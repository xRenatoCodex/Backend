import { ConclusionesGateway } from './genai/conclusiones/conclusiones.gateway';
import { TranscriptorModule } from './genai/transcriptor/transcriptor.module';
import { Module } from '@nestjs/common';
import { GenaiModule } from './genai/genai.module';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
      imports: [
            TranscriptorModule, ConfigModule.forRoot({ isGlobal: true }), GenaiModule, FirebaseModule],
      controllers: [],
      providers: [
            ConclusionesGateway,
      ],
})
export class AppModule { }
