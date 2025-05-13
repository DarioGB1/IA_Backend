import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from './interfaces/user.repository.interface';
import { Mapper, UserCreateDto, UserResponse, UserUpdateDto } from '@app/shared';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) { }


  async create(userCreateDto: UserCreateDto): Promise<UserResponse> {
    userCreateDto.password = "";
    const user = await this.userRepository.create(userCreateDto);
    return Mapper.map(user, UserResponse);
  }

  async update(id: string, userUpdateDto: UserUpdateDto): Promise<UserResponse> {
    if (!(await this.userRepository.existsById(id))) throw new Error("User not found");
    const user = await this.userRepository.update(id, userUpdateDto);
    return Mapper.map(user, UserResponse);
  }

  async delete(id: string): Promise<boolean> {
    if (!(await this.userRepository.existsById(id))) throw new Error("User not found");
    await this.userRepository.update(id, { active: false } as UserUpdateDto);
    return true;
  }
}