import { CredentialsResponse, LoginDto, UserCreateDto, VerifyCodeDto } from '@app/shared';
import { Body, Controller, Headers, Ip, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '../../guards/auth.guard';
import { Token } from '../../decorators/token.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  private setCookie(res: Response, name: string, value: string, expires: Date) {
    res.cookie(name, value, {
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
      expires
    })
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Ip() ip: string, @Headers("X-Device-Id") deviceId: string, @Res() res: Response): Promise<void> {
    const { user, accessToken, refreshToken } = await this.authService.singIn({ email: loginDto.email, password: loginDto.password, ipAddress: ip, deviceId });

    this.setCookie(res, "accessToken", accessToken.value, accessToken.expires);
    if (refreshToken) this.setCookie(res, "refreshToken", refreshToken.value, refreshToken.expires);

    const credentials: CredentialsResponse = {
      user,
      accessToken: accessToken.value,
      refreshToken: refreshToken?.value ?? null,
    }

    res.status(200).json(credentials);
  }

  @Post('register')
  async register(@Body() userCreateDto: UserCreateDto, @Res() res: Response): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.singUp(userCreateDto);

    this.setCookie(res, "accessToken", accessToken.value, accessToken.expires);
    if (refreshToken) this.setCookie(res, "refreshToken", refreshToken.value, refreshToken.expires);

    const tokens = {
      accessToken: accessToken.value,
      refreshToken: refreshToken?.value ?? null,
    }

    res.status(200).json(tokens);
  }

  @UseGuards(AuthGuard)
  @Post('verify-account')
  async verifyAccount(@Body() verifyCodeDto: VerifyCodeDto, @Token("processId") processId: string, @Ip() ipAddress: string, @Headers("X-Device-Id") deviceId: string, @Res() res: Response): Promise<void> {
    const { user, accessToken, refreshToken } = await this.authService.verifyAccount({ validationCode: verifyCodeDto.code, processId, ipAddress, deviceId });

    this.setCookie(res, "accessToken", accessToken.value, accessToken.expires);
    if (refreshToken) this.setCookie(res, "refreshToken", refreshToken.value, refreshToken.expires);

    const credentials: CredentialsResponse = {
      user,
      accessToken: accessToken.value,
      refreshToken: refreshToken?.value ?? null,
    }

    res.status(200).json(credentials);
  }
}
