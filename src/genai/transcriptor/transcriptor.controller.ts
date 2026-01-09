import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TranscribeDTO } from './dtos/transcribe.dto';
import { TranscriptorService } from './transcriptor.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('genai/transcriptor')
export class TranscriptorController {

    constructor(private readonly transcriptorService: TranscriptorService) { }

    @Post('transcribe/reusabilidad')
    @UseInterceptors(FileInterceptor('audio'))
    async transcribeAudio(@UploadedFile() audio: Express.Multer.File) {
        const text = await this.transcriptorService.transcribeAudio(audio.buffer.toString('base64'));
        return this.transcriptorService.transcript_reusabilidad(text)
    }


}
