import { Body, Controller, Post } from '@nestjs/common';
import { TranscribeDTO } from './dtos/transcribe.dto';
import { TranscriptorService } from './transcriptor.service';

@Controller('genai/transcriptor')
export class TranscriptorController {

    constructor(private readonly transcriptorService: TranscriptorService) { }

    @Post('transcribe/reusabilidad')
    async transcribeAudio(@Body() body: TranscribeDTO) {
        const text = await this.transcriptorService.transcribeAudio(body.audioBase64, body.mimeType);
        return this.transcriptorService.transcript_reusabilidad(text)
    }


}
