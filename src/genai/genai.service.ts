import { Injectable } from '@nestjs/common';
import { RECOMENDACION_SYSTEM_PROMT } from './system_promts'
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GenaiService {

    constructor(
        private configService: ConfigService
    ) { 


    }

    async recomendacion_query(query: string) {
        const requestBody = {
            contents: [
                // Role 'user' para el contenido del usuario
                {
                    role: 'user',
                    parts: [{ text: `${RECOMENDACION_SYSTEM_PROMT}\n\n conclusion a mejorar: ${query}` }],
                },
            ],
            generationConfig: {
                responseModalities: ["TEXT"],
            },
        };

        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${this.configService.get("MODEL_ID")}:${this.configService.get("GENERATE_CONTENT_API")}?key=${this.configService.get("GEMINI_API_KEY")}`, requestBody)
        return response.data
    }

    
}
