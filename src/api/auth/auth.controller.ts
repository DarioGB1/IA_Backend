import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/request/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.singIn(loginDto);
  }

  @Post("register")
  createAccount(@Body() createUserDto: CreateUserDto) {
    return this.authService.singUp(createUserDto);
  }
}
