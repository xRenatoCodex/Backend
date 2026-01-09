import { Transform, Type } from "class-transformer"
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { Hallazgos } from "./conclusion_first_file.dto"

export class ConclusionNoFirstDto {

    @IsOptional() @IsString() component_sub?: string
    @IsOptional() @IsString() component_main?: string
    @IsOptional() @IsString({ each: true }) notas?: string[]

    @IsOptional()
    @IsString()
    modelo_motor?: string

    @IsOptional()
    @IsString()
    modelo_maquina?: string

    @IsOptional()
    @IsString()
    tipo_reparacion?: string

    @IsOptional()
    @IsString()
    smcs?: string

    @IsArray() // Indica que debe ser un array
    @ValidateNested({ each: true }) // Valida cada elemento del array
    @Type(() => Hallazgos) // 💡 Usar Type para decirle a class-transformer qué objeto contiene el array
    hallazgos: Hallazgos[] // 💡 El tipo de TypeScript debe ser un array

    @IsString() @IsOptional() user_conclusion?: string

}