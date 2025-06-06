import {
  AUTH_MS,
  Credentials,
  UserLogin,
  AuthPattern,
  UserCreateDto,
  UserVerification,
  Tokens,
} from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_MS) private readonly authMS: ClientProxy) {}

  private formatTokens(tokens: Tokens): Tokens {
    return {
      accessToken: {
        value: tokens.accessToken.value,
        expires: new Date(tokens.accessToken.expires),
      },
      refreshToken: tokens.refreshToken
        ? {
            value: tokens.refreshToken.value,
            expires: new Date(tokens.refreshToken.expires),
          }
        : null,
    };
  }

  async singIn(userLogin: UserLogin): Promise<Credentials> {
    const { user, ...tokens } = await firstValueFrom<Credentials>(
      this.authMS.send<Credentials>(AuthPattern.LOGIN, userLogin),
    );

    return {
      user,
      ...this.formatTokens(tokens),
    };
  }

  async singUp(userCreateDto: UserCreateDto): Promise<Tokens> {
    return this.formatTokens(
      await firstValueFrom(this.authMS.send(AuthPattern.SINGUP, userCreateDto)),
    );
  }

  async verifyAccount(
    userVerification: UserVerification,
  ): Promise<Credentials> {
    const { user, ...tokens } = await firstValueFrom<Credentials>(
      this.authMS.send(AuthPattern.VERIFY_ACCOUNT, userVerification),
    );
    return {
      user,
      ...this.formatTokens(tokens),
    };
  }
}
