import {
  CredentialsResponse,
  LoginDto,
  UserCreateDto,
  VerifyCodeDto,
} from '@app/shared';
import { Body, Controller, Ip, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard, Token, DeviceId } from '../common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setCookie(res: Response, name: string, value: string, expires: Date) {
    res.cookie(name, value, {
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
      expires,
    });
  }

  @Post('login')
  async login(
    @Ip() ip: string,
    @DeviceId() deviceId: string,
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CredentialsResponse> {
    const { user, accessToken, refreshToken } = await this.authService.singIn({
      email: loginDto.email,
      password: loginDto.password,
      ipAddress: ip,
      deviceId,
    });

    this.setCookie(res, 'accessToken', accessToken.value, accessToken.expires);
    if (refreshToken)
      this.setCookie(
        res,
        'refreshToken',
        refreshToken.value,
        refreshToken.expires,
      );

    const credentials: CredentialsResponse = {
      user,
      accessToken: accessToken.value,
      refreshToken: refreshToken?.value ?? null,
    };
    return credentials;
  }

  @Post('register')
  async register(
    @Body() userCreateDto: UserCreateDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.singUp(userCreateDto);

    this.setCookie(res, 'accessToken', accessToken.value, accessToken.expires);
    if (refreshToken)
      this.setCookie(
        res,
        'refreshToken',
        refreshToken.value,
        refreshToken.expires,
      );

    return {
      accessToken: accessToken.value,
      refreshToken: refreshToken?.value ?? null,
    };
  }

  @UseGuards(AuthGuard)
  @Post('verify-account')
  async verifyAccount(
    @Ip() ipAddress: string,
    @DeviceId() deviceId: string,
    @Body() verifyCodeDto: VerifyCodeDto,
    @Token('processId') processId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CredentialsResponse> {
    const { user, accessToken, refreshToken } =
      await this.authService.verifyAccount({
        validationCode: verifyCodeDto.code,
        processId,
        ipAddress,
        deviceId,
      });

    this.setCookie(res, 'accessToken', accessToken.value, accessToken.expires);
    if (refreshToken)
      this.setCookie(
        res,
        'refreshToken',
        refreshToken.value,
        refreshToken.expires,
      );

    const credentials: CredentialsResponse = {
      user,
      accessToken: accessToken.value,
      refreshToken: refreshToken?.value ?? null,
    };

    return credentials;
  }
}
