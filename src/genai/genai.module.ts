import { Module } from '@nestjs/common';
import { GenaiService } from './genai.service';
import { GenaiController } from './genai.controller';
import { TranscriptorModule } from './transcriptor/transcriptor.module';

@Module({
  imports: [TranscriptorModule],
  providers: [GenaiService],
  controllers: [GenaiController]
})
export class GenaiModule { }
