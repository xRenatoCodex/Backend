import { IsOptional, IsString } from "class-validator";

export default class FileTecnicoConclusionesDTO {

    @IsString()
    @IsOptional()
    text: string
}