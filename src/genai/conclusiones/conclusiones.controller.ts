import { Body, Controller, Post } from '@nestjs/common';
import ConclusionFirstFileDto from './dtos/conclusion_first_file.dto';
import { ConclusionesService } from './conclusiones.service';
import { ConclusionNoFirstDto } from './dtos/conclusion_no_first.dto';

@Controller('conclusiones')
export class ConclusionesController {

    constructor(private conclusionService: ConclusionesService) { }

    @Post('first_file')
    async first_file(@Body()first_file_dto: ConclusionFirstFileDto) {
        return this.conclusionService.conclusion_first_file(first_file_dto)
    }

    @Post('no_first_file')
    async no_first_file(@Body()no_first_file_dto: ConclusionNoFirstDto) {
        return this.conclusionService.conclusion_no_first_file(no_first_file_dto)
    }

}
