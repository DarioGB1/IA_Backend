import { Token } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generate(
    payload: Record<string, unknown>,
    expiresInMinutes: number = 15,
  ): Promise<Token> {
    const expires = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    const value = await this.jwtService.signAsync(payload, {
      expiresIn: `${expiresInMinutes}m`,
    });
    return {
      value,
      expires,
    };
  }

  verifyToken(token: string): Promise<Record<string, unknown>> {
    return this.jwtService.verifyAsync(token);
  }
}
