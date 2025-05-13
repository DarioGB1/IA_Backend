import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthPattern, UserCreateDto, UserPattern, UserUpdate } from '@app/shared';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @MessagePattern(AuthPattern.LOGIN)
  create(@Payload() UserCreateDto: UserCreateDto) {
    return this.userService.create(UserCreateDto);
  }

  @MessagePattern(UserPattern.UPDATE_ACCOUNT)
  update(@Payload() userUpdate: UserUpdate) {
    return this.userService.update(userUpdate.id, userUpdate.updateData);
  }

  @MessagePattern(UserPattern.DELETE_ACCOUNT)
  delete(@Payload() id: string) {
    return this.userService.delete(id);
  }
}
