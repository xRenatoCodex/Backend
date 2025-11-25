import { IsString } from "class-validator";

export default class FileTecnicoConclusionesDTO {

    @IsString()
    text: string
}