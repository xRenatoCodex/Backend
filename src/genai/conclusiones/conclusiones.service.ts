import { Injectable } from '@nestjs/common';
import ConclusionFirstFileDto from './dtos/conclusion_first_file.dto';
import { ConfigService } from '@nestjs/config';
import { ConclusionNoFirstDto } from './dtos/conclusion_no_first.dto';
import { important_parts_hallazgos } from './important_parts_hallazgos';
import { generateText } from 'ai';
import { LanguageModelV2 } from '@ai-sdk/provider';
import { createVertex, vertex } from '@ai-sdk/google-vertex';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

@Injectable()
export class ConclusionesService {
    private vertex_client: LanguageModelV2

    constructor(
        private configService: ConfigService
    ) {
        const google = createGoogleGenerativeAI({
            apiKey: this.configService.get("GEMINI_API_KEY")
        })
        this.vertex_client = createVertex({ project: 'pe-fesa-ti-data-explore-dev', location: 'us-central1' })('gemini-2.5-pro')
    }


    async conclusion_first_file(conclusiones_first_file_dto: ConclusionFirstFileDto) {

        //const list_important_parts = important_parts[conclusiones_first_file_dto.smcs] || [];
        //console.log({ list_important_parts })

        const system_promt = `
**Rol:** Eres un Especialista Sénior en Reparaciones Mecánicas de Maquinaria Pesada. Tu rol es formalizar los reportes de desarmado, transformando datos brutos de evaluación en un resumen ejecutivo conciso y una lista de hallazgos técnica, precisa y objetiva. Manejarás contextos de Diagnóstico por Falla y Mantenimiento Preventivo.

  

**Regla de Ejecución Obligatoria**

Debes redactar una conclusión formal basándote únicamente en los 'HALLAZGOS' y 'DATOS DE LA REPARACIÓN' suministrados. La existencia o ausencia de una conclusión inicial del técnico es irrelevante; tu función es generar la conclusión formal.

**Estándares de Respuesta:**
  
- Tono: Formal, educado y con terminología técnica de maquinaria pesada.
- Formato: Estrictamente Markdown. Usar solo Negrita, Cursiva y Listas (* o -), Nunca usar **TITULOS [#]**

**Contenido:**  

- **Conclusión**

Un único párrafo formal y muy conciso que resuma el dictamen y las implicaciones de la intervención, evitando detalles de números de parte o disposición final.

- **Hallazgos** [Debe aparecer solo si hay mas almenos 1 hallazgo encontrado]

Una lista detallada que categorice cada componente evaluado con su disposición final estricta: Fuera de Servicio, Recuperar, Reutilizar, o Faltante.

 - **Formato Hallazgo**: 
	 - **[Descripcion] ([Part Number])**: [Detalle observacion] - Resultado : [Fuera de Servicio, Recuperar, Reutilizar, o Faltante]
	 - Ejemplo: **ROD AS (4339309) :** Presenta desgaste en su estructura - Resultado: Recuperar


**🛑 Restricciones Críticas**

- Estricta Dependencia del Dato: Las conclusiones se basarán únicamente

en los 'HALLAZGOS' y 'DATOS DE LA REPARACIÓN' proporcionados.
 - Componentes a mencionar en Hallazgos: Debes revisar esta lista de componentes críticos y filtrar los hallazgos cuyos componentes esten dentro de este listado

 ${JSON.stringify(important_parts_hallazgos)}

 - Prohibición de Alucinación: Absolutamente prohibido inventar o

inferir daños, condiciones, o información no explícitamente detallada

en el input.

- Confidencialidad: Prohibido incluir nombres de clientes, costos o

datos estratégicos.

Solo responder con la data solicitada, sin presentaciones, saludos, o cualquier informacion sin valor para el taller
`;
        const user_promt = `Por favor, genera el reporte técnico basado en los siguientes datos de entrada:

### 📋 Datos de la Reparación
* **TIPO DE REPARACIÓN:** ${conclusiones_first_file_dto.tipo_reparacion}
* **COMPONENTE PRINCIPAL:** ${conclusiones_first_file_dto.component_main}
* **HOROMETRO:** ${conclusiones_first_file_dto.component_hrs}
* **MODELO MAQUINA/EQUIPO:** ${conclusiones_first_file_dto.modelo_maquina}
* **MODELO MOTOR:** ${conclusiones_first_file_dto.modelo_motor || "N/A"}

### 💡 Hallazgos Iniciales (Raw Data)
${JSON.stringify(conclusiones_first_file_dto.hallazgos || [], null, 2)}

### Notas de SAP de la Reparación
${JSON.stringify(conclusiones_first_file_dto.notas || [], null, 2)}

${conclusiones_first_file_dto.user_conclusion && conclusiones_first_file_dto.user_conclusion.toString().length > 5 ? " ### 📝 Notas del Técnico (Contexto Adicional)\n" + conclusiones_first_file_dto.user_conclusion.toString() : "\n\n(Usa estas notas para contextualizar, pero redacta la conclusión final con un tono más formal).\ : ### 📝 Notas del Técnico\n(No se proporcionaron notas iniciales. Genera la conclusión basándote EXCLUSIVAMENTE en el análisis de los Hallazgos y el Tipo de Reparación arriba descritos)."}

                    `;
        try {
            const { text } = await generateText({
                model: this.vertex_client,
                temperature: 0.2,
                prompt: [
                    {
                        role: 'system',
                        content: system_promt.toString()
                    },
                    {
                        role: 'user',
                        content: user_promt

                    }
                ]
            })
            return text
        }
        catch (e) {
            console.log(e)
            return ""
        }
    }

    async conclusion_no_first_file(conclusiones_no_first_dto: ConclusionNoFirstDto) {

        const system_promt = `
**Rol:** Eres un Especialista Sénior en Reparaciones Mecánicas de Maquinaria Pesada. Tu rol es formalizar los reportes de desarmado, transformando datos brutos de evaluación en un resumen ejecutivo conciso y una lista de hallazgos técnica, precisa y objetiva. Manejarás contextos de Diagnóstico por Falla y Mantenimiento Preventivo.

**Regla de Ejecución Obligatoria**

Debes redactar una conclusión formal basándote únicamente en los 'HALLAZGOS' y 'DATOS DE LA REPARACIÓN' suministrados. Tu función es generar la conclusión formal en **un solo párrafo**

  

**Estándares de Respuesta:**

- Tono: Formal, educado y con terminología técnica de maquinaria pesada.

- Formato: Estrictamente Markdown. Usar solo Negrita, Cursiva y Listas (* o -), Nunca usar **TITULOS [#]**

**Contenido:**

Un único párrafo formal y muy conciso que resuma el dictamen y las implicaciones de la intervención, o disposición final.
  

**🛑 Restricciones Críticas**

- Estricta Dependencia del Dato: Las conclusiones se basarán únicamente
  
en los 'HALLAZGOS' , 'DATOS DE LA REPARACIÓN' y 'CONCLUSIONES DEL USUARIO' proporcionados.

- Prohibición de Alucinación: Absolutamente prohibido inventar o inferir daños, condiciones, o información no explícitamente detallada en el input.

- Confidencialidad: Prohibido incluir nombres de clientes, costos o datos estratégicos.

Solo responder con la data solicitada, sin presentaciones, saludos, o cualquier informacion sin valor para el taller`;
        const user_promt = `Por favor, genera el reporte técnico basado en los siguientes datos de entrada:

### 📋 Datos de la Reparación
* **TIPO DE REPARACIÓN:** ${conclusiones_no_first_dto.tipo_reparacion}
* **COMPONENTE PRINCIPAL:** ${conclusiones_no_first_dto.component_main}
* **MODELO MAQUINA/EQUIPO:** ${conclusiones_no_first_dto.modelo_maquina}
* **MODELO MOTOR:** ${conclusiones_no_first_dto.modelo_motor || "N/A"}

### 💡 Hallazgos Iniciales (Raw Data)
${JSON.stringify(conclusiones_no_first_dto.hallazgos || [], null, 2)}

### Notas de SAP de la Reparación
${JSON.stringify(conclusiones_no_first_dto.notas || [], null, 2)}

${conclusiones_no_first_dto.user_conclusion && conclusiones_no_first_dto.user_conclusion.toString().length > 5 ? " ### 📝 Notas del Técnico (Contexto Adicional)\n" + conclusiones_no_first_dto.user_conclusion.toString() : "\n\n(Usa estas notas para contextualizar, pero redacta la conclusión final con un tono más formal).\ : ### 📝 Notas del Técnico\n(No se proporcionaron notas iniciales. Genera la conclusión basándote EXCLUSIVAMENTE en el análisis de los Hallazgos y el Tipo de Reparación arriba descritos)."}

                    `
        try {
            const { text } = await generateText({
                model: this.vertex_client,
                prompt: [{
                    role: 'system',
                    content: system_promt.toString()
                }, {
                    role: 'user',
                    content: user_promt
                },]
            })
            return text
        }
        catch (e) {
            console.log(e)
            return ""
        }
    }


}
