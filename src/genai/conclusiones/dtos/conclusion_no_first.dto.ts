import { Transform, Type } from "class-transformer"
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { Hallazgos } from "./conclusion_first_file.dto"

export class ConclusionNoFirstDto {

    @IsString() component_sub: string
    @IsString() component_main: string

    @IsString()
    @IsOptional()
    modelo_motor: string

    @IsString()
    @IsOptional()
    modelo_maquina: string

    @IsString() tipo_reparacion: string
    @IsString() smcs: string

    @IsArray() // Indica que debe ser un array
    @ValidateNested({ each: true }) // Valida cada elemento del array
    @Type(() => Hallazgos) // 💡 Usar Type para decirle a class-transformer qué objeto contiene el array
    hallazgos: Hallazgos[] // 💡 El tipo de TypeScript debe ser un array

    @IsString() user_conclusion: string

}