import { Module } from '@nestjs/common';
import { GenaiService } from './genai.service';
import { GenaiController } from './genai.controller';
import { TranscriptorModule } from './transcriptor/transcriptor.module';
import { ConclusionesService } from './conclusiones/conclusiones.service';
import { ConclusionesController } from './conclusiones/conclusiones.controller';

@Module({
  imports: [TranscriptorModule],
  providers: [GenaiService, ConclusionesService],
  controllers: [GenaiController, ConclusionesController]
})
export class GenaiModule { }
