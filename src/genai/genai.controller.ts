import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import FileTecnicoConclusionesDTO from './dtos/file_tecnico-conclusiones.dto';
import { GenaiService } from './genai.service';
import { FirebaseAuthGuard } from 'src/firebase/firebase_auth.guard';

@Controller('genai')
export class GenaiController {

    constructor(private genaiService: GenaiService) { }

    @Post('file_tecnico/conclusiones')
    @UseGuards(FirebaseAuthGuard)
    async conclusiones(@Body() query: FileTecnicoConclusionesDTO) {
        return await this.genaiService.recomendacion_query(query.text)
    }

}
