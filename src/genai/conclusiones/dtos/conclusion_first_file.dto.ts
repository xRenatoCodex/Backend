import { Transform, Type } from "class-transformer"
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"

export class Hallazgos {

    @IsString()
    comentarioInterno: string
    @IsNumber()
    cantidad: number

    @IsString() dondeSeEncontro: string
    @IsString() queSeEncontro: string
    @IsString() queSeVaRealizar: string
    @IsString() queSeVaRealizar_main: string
    @IsString() numeroParte: string

}

export default class ConclusionFirstFileDto {

    @IsString() component_hrs: string
    @IsString() component_main: string
    @IsString() tipo_reparacion: string

    @IsString()
    @IsOptional()
    modelo_motor: string

    @IsString()
    @IsOptional()
    modelo_maquina: string

    @IsArray() 
    @ValidateNested({ each: true }) 
    @Type(() => Hallazgos) 
    hallazgos: Hallazgos[] 

    @IsString() user_conclusion: string

}