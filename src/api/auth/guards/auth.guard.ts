import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader: string =
      request.headers['authorization'] ?? request.cookies['accessToken'];
    if (!authHeader) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      request['user'] = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
