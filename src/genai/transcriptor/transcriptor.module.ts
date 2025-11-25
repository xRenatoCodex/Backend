/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TranscriptorController } from './transcriptor.controller';
import { TranscriptorService } from './transcriptor.service';

@Module({
    imports: [],
    controllers: [TranscriptorController],
    providers: [TranscriptorService],
})
export class TranscriptorModule { }
