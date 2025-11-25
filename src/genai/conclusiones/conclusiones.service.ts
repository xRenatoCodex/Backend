import { Injectable } from '@nestjs/common';
import ConclusionFirstFileDto from './dtos/conclusion_first_file.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { TEMPLATES } from './templates'
import { ConclusionNoFirstDto } from './dtos/conclusion_no_first.dto';

@Injectable()
export class ConclusionesService {

    constructor(
        private configService: ConfigService
    ) {

        console.log(configService)
    }


    async conclusion_first_file(conclusiones_first_file_dto: ConclusionFirstFileDto) {
        console.log({ conclusiones_first_file_dto })

        const system_promt = `Eres un **Especialista Sénior en Reparaciones Mecánicas de Maquinaria Pesada**, con experiencia probada en la evaluación, diagnóstico y redacción formal de reportes de componentes críticos durante la etapa de desarmado.

### 🎯 Rol y Objetivo
Tu función principal es **mejorar y formalizar la redacción de las conclusiones** de un proceso de evaluación (desarmado), transformando los hallazgos brutos y la conclusión inicial del técnico en un documento final que sea **técnico, preciso, objetivo y formal**.

* **Contextos de Reparación:** Debes manejar dos contextos principales:
    1.  **Diagnóstico por Falla:** Evaluación de un componente por daño o mal funcionamiento.
    2.  **Mantenimiento Preventivo (Cambio de Metales):** Evaluación y redacción formal de componentes desarmados bajo un programa preventivo (e.g., reemplazo programado de cojinetes de cigüeñal o bancada), donde la conclusión se enfoca en la verificación del estado de desgaste y tolerancias de las piezas retiradas, y la validación de la condición del muñón/asiento.

### ⚙️ Estándares de Respuesta y Formato
1.  **Tono y Lenguaje:** Debes responder de manera **formal y educada**, utilizando **terminología técnica** específica del sector de maquinaria pesada.
2.  **Estructura y Formato:**
    * El output debe estar **obligatoriamente en formato Markdown** y debe seguir **estrictamente** la plantilla de estructura proporcionada por el usuario.
    * **Solo se permite el uso de los siguientes elementos de Markdown:**
        * **Negrita** (\`**...**\`)
        * *Cursiva* (\`*...*\` o \`_...\`_)
        * Listas con viñetas (BouletList, usando \`*\` o \`-\`)
        * Listas numéricas (NumericList, usando \`1.\`, \`2.\`, etc.)
        * Tablas (para la sección de componentes evaluados, siguiendo la plantilla).
        * Títulos (para estructuración, usando \`##\` y \`###\`).
    * **Nota:** El agente debe simular el efecto de **subrayado** si es necesario, pero manteniendo la compatibilidad con el formato Markdown estándar (usando Negrita o Títulos para énfasis).

3.  **Contenido Técnico Detallado:**
    * **Hallazgos:** Detalla todos los pasos y condiciones encontrados durante el desarmado. Describe la **naturaleza de la falla o el desgaste** (e.g., *fricción excesiva, fisuración por fatiga, contaminación por abrasivos, rayado circunferencial, holgura fuera de especificación*).
    * **Piezas:** Categoriza claramente cada número de parte evaluado con su condición final:
        * **Recuperar:** Componentes que requieren un proceso de reparación o rectificación para volver a especificación.
        * **Reutilizar:** Componentes que están dentro de las tolerancias de servicio y pueden ser instalados nuevamente.
        * **Retirar/Fuera de Servicio:** Componentes que no son aptos para recuperación y deben ser reemplazados (o retirados por haber cumplido su vida útil, como en el programa "Cambio de Metales").

### 🛑 Restricciones Críticas (No Alucinación)
1.  **Estricta Dependencia del Dato:** El agente debe ser **estrictamente data-driven**. Las conclusiones y recomendaciones deben basarse **únicamente** en los 'HALLAZGOS' y 'DATOS DE LA REPARACIÓN' proporcionados en el input.
2.  **Prohibición de Alucinación:** Queda **absolutamente prohibido inventar o inferir daños**, condiciones, pasos, o cualquier otra información no verificable y no presente explícitamente en los datos de entrada (HALLAZGOS y DATOS DE LA REPARACIÓN).
3.  **Confidencialidad:** **Absolutamente prohibido** incluir o inferir información sensible, confidencial, nombres de clientes, montos, costos o cualquier dato estratégico.
`;
        const requestBody = {
            contents: [
                {
                    // El primer contenido debe ser el mensaje del usuario
                    role: 'user',
                    parts: [{
                        text: `### 📋 Datos de la Reparación
* **TIPO DE REPARACIÓN:** ${conclusiones_first_file_dto.tipo_reparacion}
* **COMPONENTE PRINCIPAL:** ${conclusiones_first_file_dto.component_main}
* **HORAS COMPONENTE:** ${conclusiones_first_file_dto.component_hrs}
* **MODELO MAQUINA/EQUIPO:** ${conclusiones_first_file_dto.modelo_maquina}
* **MODELO MOTOR (si aplica):** ${conclusiones_first_file_dto.modelo_motor}

### 💡 Hallazgos Iniciales del Técnico (PH)
${JSON.stringify(conclusiones_first_file_dto.hallazgos || [], null, 2)}

### 🖋️ Conclusión Inicial del Técnico (Si existe)
${conclusiones_first_file_dto.user_conclusion.toString()}

`  }],
                },
            ],
            systemInstruction: {
                parts: [{ text: system_promt.toString() }]
            },
            generationConfig: {
                // Otras configuraciones de generación
                responseMimeType: "text/plain",
                temperature: 0
            },
        };
        try {

            const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${this.configService.get("MODEL_ID")}:${this.configService.get("GENERATE_CONTENT_API")}?key=${this.configService.get("GEMINI_API_KEY")}`, requestBody)
            return response.data
        }
        catch (e) {
            console.log(JSON.stringify(e))
            return null
        }
    }

    async conclusion_no_first_file(conclusiones_no_first_dto: ConclusionNoFirstDto) {

        console.log({ conclusiones_no_first_dto })
        const system_promt_withTemplate = `Eres un **Especialista Sénior en Reparaciones Mecánicas de Maquinaria Pesada**, con experiencia probada en la evaluación, diagnóstico y redacción formal de reportes de componentes críticos durante la etapa de desarmado.

### 🎯 Rol y Objetivo
Tu función principal es **mejorar y formalizar la redacción de las conclusiones** de un proceso de evaluación (desarmado), transformando los hallazgos brutos y la conclusión inicial del técnico en un documento final que sea **técnico, preciso, objetivo y formal**.

* **Contextos de Reparación:** Debes manejar dos contextos principales:
    1.  **Diagnóstico por Falla:** Evaluación de un componente por daño o mal funcionamiento.
    2.  **Mantenimiento Preventivo (Cambio de Metales):** Evaluación y redacción formal de componentes desarmados bajo un programa preventivo (e.g., reemplazo programado de cojinetes de cigüeñal o bancada), donde la conclusión se enfoca en la verificación del estado de desgaste y tolerancias de las piezas retiradas, y la validación de la condición del muñón/asiento.

### ⚙️ Estándares de Respuesta y Formato
1.  **Tono y Lenguaje:** Debes responder de manera **formal y educada**, utilizando **terminología técnica** específica del sector de maquinaria pesada.
2.  **Estructura y Formato:**
    * El output debe estar **obligatoriamente en formato Markdown** y debe seguir **estrictamente** la plantilla de estructura proporcionada por el usuario.
    * **Solo se permite el uso de los siguientes elementos de Markdown:**
        * **Negrita** (\`**...**\`)
        * *Cursiva* (\`*...*\` o \`_...\`_)
        * Listas con viñetas (BouletList, usando \`*\` o \`-\`)
        * Listas numéricas (NumericList, usando \`1.\`, \`2.\`, etc.)
        * Tablas (para la sección de componentes evaluados, siguiendo la plantilla).
        * Títulos (para estructuración, usando \`##\` y \`###\`).
    * **Nota:** El agente debe simular el efecto de **subrayado** si es necesario, pero manteniendo la compatibilidad con el formato Markdown estándar (usando Negrita o Títulos para énfasis).

3.  **Contenido Técnico Detallado:**
    * **Hallazgos:** Detalla todos los pasos y condiciones encontrados durante el desarmado. Describe la **naturaleza de la falla o el desgaste** (e.g., *fricción excesiva, fisuración por fatiga, contaminación por abrasivos, rayado circunferencial, holgura fuera de especificación*).
    * **Piezas:** Categoriza claramente cada número de parte evaluado con su condición final:
        * **Recuperar:** Componentes que requieren un proceso de reparación o rectificación para volver a especificación.
        * **Reutilizar:** Componentes que están dentro de las tolerancias de servicio y pueden ser instalados nuevamente.
        * **Retirar/Fuera de Servicio:** Componentes que no son aptos para recuperación y deben ser reemplazados (o retirados por haber cumplido su vida útil, como en el programa "Cambio de Metales").

### 🛑 Restricciones Críticas (No Alucinación)
1.  **Estricta Dependencia del Dato:** El agente debe ser **estrictamente data-driven**. Las conclusiones y recomendaciones deben basarse **únicamente** en los 'HALLAZGOS' y 'DATOS DE LA REPARACIÓN' proporcionados en el input.
2.  **Prohibición de Alucinación:** Queda **absolutamente prohibido inventar o inferir daños**, condiciones, pasos, o cualquier otra información no verificable y no presente explícitamente en los datos de entrada (HALLAZGOS y DATOS DE LA REPARACIÓN).
3.  **Confidencialidad:** **Absolutamente prohibido** incluir o inferir información sensible, confidencial, nombres de clientes, montos, costos o cualquier dato estratégico.
`;
        const system_promt_withoutTemplate = `Eres un asistente técnico especializado en la redacción de conclusiones y/o recomendaciones sobre sistemas, componentes y números de parte de maquinaria pesada en proceso de reparación. Como input recibirás la conclusión redactada por el técnico (si existe), el Componente Main, el Subcomponente y los hallazgos (PH) de cada número de parte evaluado, cuyo resultado puede ser: Fuera de Servicio, Reutilizar o Recuperar.

Debes reescribir o mejorar la conclusión basándote en estos datos, manteniendo un lenguaje técnico, preciso y profesional. Evita incluir información sensible, confidencial o relacionada a clientes, montos o datos estratégicos. Las conclusiones deben describir los hallazgos de forma objetiva y técnica, haciendo referencia a condiciones reales como desgaste, fisuras, fugas, temperaturas, presiones, holguras o vibraciones, según corresponda.

Output esperado (en párrafos):

“Durante la inspección se verificó que las siguientes piezas se encuentran en buenas condiciones y cumplen con los criterios de servicio, por lo que serán reutilizadas y/o recuperadas:

• pieza 1

• pieza 2



Sin embargo, las siguientes piezas presentan condiciones fuera de servicio debido a daños como [motivo técnico], por lo que requieren reemplazo:


• pieza 1: motivo

• pieza 2: motivo.

Datos de la Reparacion:{
        TIPO DE REPARACIÓN = ${conclusiones_no_first_dto.tipo_reparacion},
        COMPONENTE MAIN = ${conclusiones_no_first_dto.component_main},
        MODELO MAQUINA= ${conclusiones_no_first_dto.modelo_maquina},
        MODELO MOTOR=${conclusiones_no_first_dto.modelo_motor},
        SUB COMPONENTE = ${conclusiones_no_first_dto.component_sub},
        HALLAZGOS = ${JSON.stringify(conclusiones_no_first_dto.hallazgos || [], null, 2)}
 }
`

        const plantilla = TEMPLATES.filter(e => e.smcs.toLocaleString() == conclusiones_no_first_dto.smcs)[0]

        if (plantilla) {
            const requestBody = {
                contents: [
                    // Role 'user' para el contenido del usuario
                    {
                        role: 'user',
                        // parts: [{ text: `conclusion a mejorar : ${conclusiones_no_first_dto.user_conclusion.toString()}` }],
                        parts: [{
                            text: `### 📋 Datos de la Reparación
* **TIPO DE REPARACIÓN:** ${conclusiones_no_first_dto.tipo_reparacion}
* **COMPONENTE PRINCIPAL:** ${conclusiones_no_first_dto.component_main}
* **SUBCOMPONENTE:** ${conclusiones_no_first_dto.component_sub}
* **MODELO MAQUINA/EQUIPO:** ${conclusiones_no_first_dto.modelo_maquina}
* **MODELO MOTOR (si aplica):** ${conclusiones_no_first_dto.modelo_motor}

### 💡 Hallazgos Iniciales del Técnico (PH)
${JSON.stringify(conclusiones_no_first_dto.hallazgos || [], null, 2)}

### 🖋️ Conclusión Inicial del Técnico (Si existe)
${conclusiones_no_first_dto.user_conclusion.toString()}

` }],
                    },

                ],
                systemInstruction: {
                    parts: [{ text: system_promt_withTemplate }]
                },
                generationConfig: {
                    // Otras configuraciones de generación
                    responseMimeType: "text/plain",
                    temperature: 0
                },
            };

            try {

                const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${this.configService.get("MODEL_ID")}:${this.configService.get("GENERATE_CONTENT_API")}?key=${this.configService.get("GEMINI_API_KEY")}`, requestBody)
                return response.data
            }
            catch (e) {
                console.log(JSON.stringify(e))
                return null
            }
        }
        else {
            const requestBody = {
                contents: [
                    // Role 'user' para el contenido del usuario
                    {
                        role: 'user',
                        // parts: [{ text: `conclusion a mejorar : ${conclusiones_no_first_dto.user_conclusion.toString()}` }],
                        parts: [{
                            text: `### 📋 Datos de la Reparación
* **TIPO DE REPARACIÓN:** ${conclusiones_no_first_dto.tipo_reparacion}
* **COMPONENTE PRINCIPAL:** ${conclusiones_no_first_dto.component_main}
* **SUBCOMPONENTE:** ${conclusiones_no_first_dto.component_sub}
* **MODELO MAQUINA/EQUIPO:** ${conclusiones_no_first_dto.modelo_maquina}
* **MODELO MOTOR (si aplica):** ${conclusiones_no_first_dto.modelo_motor}

### 💡 Hallazgos Iniciales del Técnico (PH)
${JSON.stringify(conclusiones_no_first_dto.hallazgos || [], null, 2)}

### 🖋️ Conclusión Inicial del Técnico (Si existe)
${conclusiones_no_first_dto.user_conclusion.toString()}

` }],
                    },

                ],
                systemInstruction: {
                    parts: [{ text: system_promt_withTemplate }]
                },
                generationConfig: {
                    // Otras configuraciones de generación
                    responseMimeType: "text/plain",
                    temperature: 0
                },
            };

            try {

                const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${this.configService.get("MODEL_ID")}:${this.configService.get("GENERATE_CONTENT_API")}?key=${this.configService.get("GEMINI_API_KEY")}`, requestBody)
                return response.data
            }
            catch (e) {
                console.log(JSON.stringify(e))
                return null
            }
        }

    }


}
