import { Controller, Post, Body, UseGuards, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/request/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { CodeGuard } from './guards/code.guard';
import { VerifyCodeDto } from './dto/request/verify-code.dto';
import { Request, Response } from 'express';
import { CookieOptions } from '../utils/cookie-options';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const credentials = await this.authService.singIn(loginDto);
    res.cookie('accessToken', credentials.accessToken, {
      maxAge: +process.env.JWT_EXPIRATION_TIME_IN_MINUTES! * 60 * 1000,
      ...CookieOptions,
    });
    res.status(200).json(credentials);
  }

  @Post('register')
  async createAccount(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const credentials = await this.authService.singUp(createUserDto);
    res.cookie('accessToken', credentials.accessToken, {
      maxAge: +process.env.JWT_EXPIRATION_TIME_IN_MINUTES! * 60 * 1000,
      ...CookieOptions,
    });
    res.status(201).json(credentials);
  }
  @Post('verify')
  @UseGuards(AuthGuard, CodeGuard)
  async verify(@Req() req: Request, @Body() verifyCodeDto: VerifyCodeDto) {
    await this.authService.validateAccount(req['user'].id as string);
    return { message: 'account verified.' };
  }
}
