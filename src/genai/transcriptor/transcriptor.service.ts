import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from "axios"
import { generateText, generateObject } from 'ai'
import { createGoogleGenerativeAI, google } from '@ai-sdk/google'
import { SpeechClient } from '@google-cloud/speech'
import { LanguageModelV2 } from '@ai-sdk/provider';
import { createVertex, vertex } from '@ai-sdk/google-vertex';
import { MaintenanceRecordSchema } from './reusabilidad.schema'

@Injectable()
export class TranscriptorService {
    private speechClient: SpeechClient = new SpeechClient()
    private vertex_client: LanguageModelV2

    constructor(
        private readonly configService: ConfigService
    ) {

        const google = createGoogleGenerativeAI({
            apiKey: this.configService.get("GEMINI_API_KEY")
        })
        this.vertex_client = google('gemini-2.5-pro')

    }

    async transcribeAudio(audioBase64: string) {
        try {

            const [text_response, ...rest] = await this.speechClient.recognize({
                audio: {
                    content: audioBase64
                },
                config: {
                    languageCode: 'es-ES',
                    sampleRateHertz: 16000,
                    encoding: 'MP3'
                }
            })
            console.log({ text_response })
            return text_response.results.map(result => result.alternatives[0].transcript).join('\n');

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

    async transcript_reusabilidad(text: string) {
        console.log({ text })

        const result = await generateObject({
            model: this.vertex_client,
            schema: MaintenanceRecordSchema,
            system: `Eres un asistente experto en mantenimiento de maquinaria. 
  Analiza el texto y extrae la información siguiendo estrictamente las opciones permitidas.
  IMPORTANTE: 'que_se_va_realizar_adicional' depende de 'que_se_va_realizar'. 
  Ejemplo: Si la acción es 'FUERA DE SERVICIO', el adicional solo puede ser 'NUEVO' o 'CORE / REMAN'.`,
            prompt: "El texto conversacional aquí...\n\n" + text,
        });

        return result.object;
    }
}
