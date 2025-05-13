import { Controller } from '@nestjs/common';
import { AuthService } from './aut.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserCreateDto, UserLogin, UserVerification } from '@app/shared';
import { AuthPattern } from '@app/shared/patterns';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern(AuthPattern.LOGIN)
  async login(@Payload() userLogin: UserLogin) {
    return await this.authService.login(userLogin);
  }

  @MessagePattern(AuthPattern.CREATE_ACCOUNT)
  async createAccount(@Payload() createUserDto: UserCreateDto) {
    return await this.authService.createAccount(createUserDto);
  }

  @MessagePattern(AuthPattern.VERIFY_ACCOUNT)
  async verifyAccount(@Payload() userVerification: UserVerification) {
    return await this.authService.verifyAccount(userVerification);
  }
}
