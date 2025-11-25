// firebase.config.ts (O donde inicialices tu Admin SDK)
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { credential } from 'firebase-admin';

@Injectable()
export class FirebaseAuthService {
   
    constructor(private configService: ConfigService) {

        if (!admin.apps.length) {
            admin.initializeApp();
        }
    }

    getAuth() {
        return admin.auth()
    }

}