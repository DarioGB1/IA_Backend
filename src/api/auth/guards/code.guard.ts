import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CodeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const user = request['user'] as { id: string; code: string }; // Obtenemos el user asignado por JwtGuard

    if (!user || !user.code) {
      throw new ForbiddenException('Código no presente en el token');
    }

    const codeFromRequest: string | undefined =
      request.body?.code || request.query?.code || request.params?.code;

    if (!codeFromRequest) {
      throw new ForbiddenException('Código no proporcionado en la solicitud');
    }

    if (user.code !== codeFromRequest) {
      throw new ForbiddenException('Código inválido');
    }

    return true;
  }
}
