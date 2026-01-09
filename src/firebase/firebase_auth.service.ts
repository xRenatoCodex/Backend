// firebase.config.ts (O donde inicialices tu Admin SDK)
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { credential } from 'firebase-admin';

@Injectable()
export class FirebaseAuthService {

    constructor(private configService: ConfigService) {

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: credential.cert({
                    projectId: this.configService.get<string>('FIREBASE_PROJECTID'),
                    clientEmail: this.configService.get<string>('FIREBASE_EMAIL'),
                    privateKey: this.configService.get<string>('FIREBASE_PRIVATEKEY')?.replace(/\\n/g, '\n'),
                })
            });
        }
    }

    getAuth() {
        return admin.auth()
    }

}