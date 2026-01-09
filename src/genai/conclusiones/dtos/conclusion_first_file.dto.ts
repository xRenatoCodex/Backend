import { Transform, Type } from "class-transformer"
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"

export class Hallazgos {

    @IsString()
    @IsOptional()
    comentarioExterno?: string

    @IsString()
    @IsOptional()
    evaluacion_resultado?: string

    @IsString()
    @IsOptional()
    resultado_comentarioExterno?: string

    @IsNumber()
    @IsOptional()
    cantidad: number

    @IsString() @IsOptional() dondeSeEncontro?: string
    @IsString() @IsOptional() queSeEncontro?: string
    @IsString() @IsOptional() queSeVaRealizar?: string
    @IsString() @IsOptional() queSeVaRealizar_main?: string
    @IsString() @IsOptional() numeroParte?: string

}

export default class ConclusionFirstFileDto {

    @IsOptional() @IsString() component_hrs?: string
    @IsOptional() @IsString() component_main?: string
    @IsOptional() @IsString() tipo_reparacion?: string

    @IsOptional()
    @IsString({ each: true })
    notas?: string[]

    @IsOptional()
    @IsString()
    modelo_motor?: string

    @IsOptional()
    @IsString()
    modelo_maquina?: string

    @IsOptional()
    @IsString()
    smcs?: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Hallazgos)
    hallazgos: Hallazgos[]

    @IsOptional()
    @IsString()
    user_conclusion?: string

}