import { TranscriptorModule } from './genai/transcriptor/transcriptor.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GenaiModule } from './genai/genai.module';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
        TranscriptorModule, ConfigModule.forRoot({ isGlobal: true }), GenaiModule, FirebaseModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
