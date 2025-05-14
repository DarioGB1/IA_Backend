import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserCreateDto, UserPattern, UserUpdate } from '@app/shared';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @MessagePattern(UserPattern.CREATE_ACCOUNT)
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
