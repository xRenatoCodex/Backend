import { IsOptional, IsString } from "class-validator";

export class TranscribeDTO {
    @IsString()
    audioBase64: string;
    
    @IsOptional()
    @IsString()
    mimeType?: string;
}