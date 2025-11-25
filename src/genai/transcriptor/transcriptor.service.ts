import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from "axios"

@Injectable()
export class TranscriptorService {
    private GEMINI_API_KEY: string
    private MODEL_ID: string
    private GENERATE_CONTENT_API: string
    private OPENAI_API_KEY: string

    constructor(
        private readonly configService: ConfigService
    ) {
        this.GEMINI_API_KEY = this.configService.get<string>('GEMINI_API_KEY')
        this.MODEL_ID = this.configService.get<string>('MODEL_ID')
        this.GENERATE_CONTENT_API = this.configService.get<string>('GENERATE_CONTENT_API')
        this.OPENAI_API_KEY = this.configService.get<string>('OPENAI_API_KEY')

    }

    async transcribeAudio(audioBase64, mimeType = 'audio/webm') {
        try {
            console.log('Iniciando transcripción con Whisper...')

            // Convertir base64 a blob
            const audioBuffer = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
            const audioBlob = new Blob([audioBuffer], { type: mimeType });

            // Crear FormData para la API de Whisper
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.webm');
            formData.append('model', 'whisper-1');
            formData.append('language', 'es'); // Español para el contexto del taller mecánico
            formData.append('response_format', 'text');
            formData.append('temperature', '0.2'); // Baja temperatura para mayor precisión en términos técnicos

            // Prompt para mejorar la transcripción en contexto de taller mecánico
            const prompt = "Este audio contiene información técnica sobre inspección de maquinaria pesada en un taller mecánico. Incluye términos como: cantidad, horas, desgaste, fisuras, corrosión, soldadura, reparación, componentes, repuestos, evaluación.";
            formData.append('prompt', prompt);

            const response = await axios.post('https://api.openai.com/v1/audio/transcriptions',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const transcribedText = response.data;
            console.log('Transcripción completada:', transcribedText);

            return transcribedText;

        } catch (error) {
            console.error('Error en transcripción Whisper:', error);

            if (error.response) {
                console.error('Error response:', error.response.data);
                throw new Error(`Error de API Whisper: ${error.response.data.error?.message || 'Error desconocido'}`);
            } else {
                throw new Error(`Error de transcripción: ${error.message}`);
            }
        }
    }

    async transcript_reusabilidad(text) {

        const response = await axios.post('https://api.openai.com/v1/chat/completions',
            {
                "model": "gpt-4o",
                "messages": [
                    {
                        "role": "system",
                        "content": "\nTu misión es convertir el siguiente **texto conversacional** en un objeto **JSON** con la siguiente estructura y reglas:\n\n`{  \"part_number\":  \"string\",  \"cantidad\":  {  \"type\":  \"set | add | remove\",  \"value\":  \"number\"  },  \"horas\":  {  \"type\":  \"set | add | remove\",  \"value\":  \"number\"  },  \"que_se_encontro\":  \"una opción del listado permitido\",  \"donde_se_encontro\":  \"una opción del listado permitido\",  \"que_se_va_realizar\":  \"una opción del listado permitido\",  \"que_se_va_realizar_adicional\":  \"una opción válida según que_se_va_realizar\",  \"comentarios_internos\":  \"string\",  \"comentarios_externos\":  \"string\"  }` \n\n----------\n\n### Listados de opciones\n\n#### 🔹 Opciones para `que_se_encontro`\n\n`\"ATASCAMIENTO / AGARROTAMIENTO\", \"BUENAS CONDICIONES\", \"buscar que se encontro\", \"CONTAMINACIÓN / MATERIAL EXTRAÑO\", \"CONTAMINACIÓN DE FLUIDO\", \"DEFECTO DE RECUBRIMIENTO\", \"DEFECTO DE SOLDADURA\", \"DEFLECTOR SUELTO\", \"DEFORMACIÓN / DEFLEXIÓN\", \"DESGASTE\", \"DESGASTE ADHESIVO\", \"DESGASTE ESCALONADO\", \"DESGASTE Y FISURAS\", \"DESPRENDIMIENTO DE MATERIAL\", \"DETERIORO\", \"EROSIÓN POR CAVITACIÓN\", \"FALTA DE DOCUMENTO TÉCNICO\", \"FALTA DE LUBRICACIÓN\", \"FISURAS\", \"FRETTING\", \"FUERA DE ESPECIFICACIONES\", \"FUGA\", \"HILOS ALTOS\", \"INDENTACIÓN / HENDIDURA\", \"NO APLICA\", \"ÓXIDO / CORROSIÓN\", \"PARTE / REPUESTO FALTANTE\", \"PARTE / REPUESTO NO CAT\", \"PARTE(S) NO PERTENECE(N) A COMPONENTE\", \"PICADURAS\", \"POROSIDAD\", \"POSIBLES FISURAS\", \"RAYADURAS\", \"ROTURA / FRACTURA\", \"SCORING\"` \n\n----------\n\n#### 🔹 Opciones para `donde_se_encontro`\n\n`\"ACOPLE CON SLEEVE 2.0\", \"ALOJAMIENTO DE BEARING\", \"ALOJAMIENTO DE INYECTOR\", \"ALOJAMIENTO DE PIN\", \"ALOJAMIENTO DE SELLO\", \"ALOJAMIENTO DE SELLO DUO CONE\", \"ALOJAMIENTO EJE PIVOT\", \"ALOJAMIENTO INTERNO DE PIN\", \"ALOJAMIENTOS\", \"ALOJAMIENTOS ROSCADOS\", \"BARRA ECUALIZADORA\", \"buscar donde se encontro\", \"CANAL CHAVETERO\", \"CANAL CHAVETERO / DIAMETRO EXTERIOR\", \"CANAL GUÍA\", \"CARA DEL DIENTE\", \"CONTRAPESO\", \"DIAMETRO DE ASENTAMIENTO\", \"DIAMETRO DE BOCINA\", \"DIÁMETRO EXTERNO\", \"DIÁMETRO INTERNO\", \"EJE\", \"ESTRUCTURA / CUERPO\", \"FALDA\", \"GALERÍAS DE LUBRICACIÓN\", \"GENERAL\", \"HOUSING\", \"IMPACTO DE BOGGIES\", \"INSERTO\", \"LATERAL\", \"MATERIAL DE FRICCIÓN\", \"nueva revisión\", \"nuevaimagenes\", \"nuevapo\", \"nuevoplan\", \"nuevoregistro\", \"PARABRISAS\", \"PARRILLAS DE CAUCHO\", \"PARTE / SUPERFICIE EXTERIOR\", \"PARTE / SUPERFICIE INTERIOR\", \"PERNO(S)\", \"PIEZA\", \"PIEZA ENTERA\", \"PIN DE TRABA\", \"prueba 7\", \"PUÑO DE BIELA Y BANCADA\", \"RANURA DE ANILLOS\", \"REPUESTO\", \"RODAJE\", \"RODILLOS PESTAÑA SIMPLE Y DOBLE\", \"RODILLOS Y RUEDAS\", \"RODILLOS Y/O RUEDAS GUÍAS\", \"RUEDA GUIA\", \"SEGMENTO ROSCADO\", \"SELLO(S)\", \"SHAFT PIVOT\", \"SOPORTE\", \"SOPORTE DE PIN\", \"SUPERFICIE DE COMBUSTIÓN\", \"SUPERFICIE DE CONTACTO\", \"SUPERFICIE DE CONTACTO CON MANIFOLD\", \"SUPERFICIE DE VISOR\", \"SUPERFICIE EXTERNA\", \"SUPERFICIE PLANA\", \"UBICACION NUEVA\", \"UNIÓN SOLDADA\", \"UNION TUBO FRAME\", \"UNION TUBO Y NUT\", \"VOLANTE\", \"ZONA DE PLANCHA\", \"ZONA DE RODADURA\", \"ZONA DE SELLADO\", \"ZONA DENTADA\", \"ZONA ESTRIADA\", \"ZONA EXTERNA\", \"ZONA EXTERNA Y ZONA DENTADA\", \"ZONA EXTERNA, ZONA DE CONCENTRACION DE ESFUERZO\", \"ZONA INTERNA\"` \n\n----------\n\n#### 🔹 Opciones para `que_se_va_realizar` y `que_se_va_realizar_adicional`\n\n`quesevarealizaroptions = [  {  \"description\":  \"EVALUAR\",  \"adicionales\":  [\"INTERNA\",  \"PROVEEDOR\",  \"SOLDADURA/MECANIZADO\"]  },  {  \"description\":  \"EVALUAR/RECUPERAR\",  \"adicionales\":  [\"INTERNA\",  \"PROVEEDOR\",  \"SOLDADURA/MECANIZADO\"]  },  {  \"description\":  \"FALTANTE\",  \"adicionales\":  []  },  {  \"description\":  \"FUERA DE SERVICIO\",  \"adicionales\":  [\"CORE / REMAN\",  \"NUEVO\"]  },  {  \"description\":  \"RECUPERAR\",  \"adicionales\":  [\"PROVEEDOR\",  \"SOLDADURA/MECANIZADO\"]  },  {  \"description\":  \"REUTILIZAR\",  \"adicionales\":  []  }  ]` \n\n----------\n\n### Reglas\n\n1.  El JSON debe estar siempre **bien formado**.\n    \n2.  Si un campo no aplica → usar `null`.\n    \n3.  Para `que_se_va_realizar_adicional`:\n    \n    -   Solo puede elegirse **una opción** de la lista de `adicionales` vinculada al valor elegido en `que_se_va_realizar`.\n        \n    -   Si no hay adicionales disponibles → usar `null`.\n        \n4.  Los valores deben salir únicamente del **texto conversacional** provisto.\n    \n5.  El texto a evaluar se proporcionará al final, entre `***`."
                    },
                    {
                        "role": "user",
                        "content": `***${text}***`
                    }
                ],
                "response_format": {
                    "type": "json_object"
                },
                "temperature": 0.25,
                "max_tokens": 4096,
                "top_p": 1
            }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.OPENAI_API_KEY}`
            }
        }
        )
        return JSON.parse(response.data.choices[0].message.content)
    }
}
