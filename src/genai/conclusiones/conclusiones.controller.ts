import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import ConclusionFirstFileDto from './dtos/conclusion_first_file.dto';
import { ConclusionesService } from './conclusiones.service';
import { ConclusionNoFirstDto } from './dtos/conclusion_no_first.dto';
import { FirebaseAuthGuard } from 'src/firebase/firebase_auth.guard';

@Controller('conclusiones')
export class ConclusionesController {

    constructor(private conclusionService: ConclusionesService) { }

    @Post('first_file')
    @UseGuards(FirebaseAuthGuard)
    async first_file(@Body() first_file_dto: ConclusionFirstFileDto) {
        return this.conclusionService.conclusion_first_file(first_file_dto)
    }

    @Post('no_first_file')
    @UseGuards(FirebaseAuthGuard)
    async no_first_file(@Body() no_first_file_dto: ConclusionNoFirstDto) {
        return this.conclusionService.conclusion_no_first_file(no_first_file_dto)
    }

}
