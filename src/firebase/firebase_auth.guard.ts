// src/guards/firebase-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin'; // Importar el tipo, aunque usaremos la inyección
import { Request } from 'express'; // Para tipado de la solicitud

// NOTA: Usaremos la inyección de la instancia de Auth de Firebase Admin
@Injectable()
export class FirebaseAuthGuard implements CanActivate {

  // Puedes inyectar la instancia de Auth si usas un módulo personalizado
  // constructor(@Inject('FIREBASE_AUTH') private readonly firebaseAuth: admin.auth.Auth) {}

  // O si tienes acceso global, usar el SDK inicializado:
  private firebaseAuth = admin.auth(); // Asegúrate de que Firebase ya esté inicializado

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    // 1. Obtener el objeto de solicitud (Request)
    const request = context.switchToHttp().getRequest<Request>();

    // 2. Extraer el token del encabezado 'Authorization'
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token de autenticación no proporcionado.');
    }

    try {
      // 3. Verificar el ID Token con Firebase Admin SDK
      const decodedToken = await this.firebaseAuth.verifyIdToken(token);

      // 4. Adjuntar el objeto de usuario (DecodedIdToken) a la solicitud
      //    para que los controladores puedan acceder a la información del usuario (UID, email, etc.)
      request['user'] = decodedToken;

      // 5. Si la verificación es exitosa, permitir el acceso
      return true;

    } catch (error) {
      // Si la verificación falla (token expirado, inválido, etc.)
      console.error('Firebase Token Validation Error:', error);
      throw new UnauthorizedException('Token de autenticación inválido o expirado.');
    }
  }

  /**
   * Helper para extraer el token Bearer del encabezado
   * @param request El objeto de solicitud de Express
   * @returns El token o undefined
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // Esperamos el formato "Bearer <token>"
    return type === 'Bearer' ? token : undefined;
  }
}