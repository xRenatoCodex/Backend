import { Module } from '@nestjs/common';
import { FirebaseAuthService } from './firebase_auth.service';

@Module({
    providers:[FirebaseAuthService]
})
export class FirebaseModule {}
