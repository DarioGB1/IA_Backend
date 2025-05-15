import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from './interfaces/user.repository.interface';
import {
  ApiException,
  Mapper,
  UserCreateDto,
  UserResponse,
  UserUpdateDto,
  ValidatePassword,
} from '@app/shared';
import { Hash } from '../utils/hash';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async create(userCreateDto: UserCreateDto): Promise<UserResponse> {
    console.log(userCreateDto);
    userCreateDto.password = await Hash.generate(userCreateDto.password);
    const user = await this.userRepository.create(userCreateDto);
    return Mapper.map(user, UserResponse);
  }

  async update(
    id: string,
    userUpdateDto: UserUpdateDto,
  ): Promise<UserResponse> {
    if (!(await this.userRepository.existsById(id)))
      throw new Error('User not found');
    const user = await this.userRepository.update(id, userUpdateDto);
    return Mapper.map(user, UserResponse);
  }

  async delete(id: string): Promise<boolean> {
    if (!(await this.userRepository.existsById(id)))
      throw new Error('User not found');
    await this.userRepository.update(id, { active: false } as UserUpdateDto);
    return true;
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    const user = await this.userRepository.getByEmail(email);
    return user ? Mapper.map(user, UserResponse) : null;
  }

  async validatePassword(
    validatePassword: ValidatePassword,
  ): Promise<UserResponse> {
    const user = await this.userRepository.getByEmail(validatePassword.email);
    if (!user) throw new RpcException(ApiException.notFound());
    if (!(await Hash.compare(validatePassword.password, user.password)))
      throw new RpcException(ApiException.forbidden('Invalid password'));
    return Mapper.map(user, UserResponse);
  }
}
