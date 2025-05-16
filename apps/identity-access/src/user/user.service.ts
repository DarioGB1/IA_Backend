import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from './interfaces/user.repository.interface';
import {
  Mapper,
  UserCreateDto,
  UserResponse,
  UserUpdateDto,
  ValidatePassword,
} from '@app/shared';
import { Hash } from '../utils/hash';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async create(userCreateDto: UserCreateDto): Promise<UserResponse> {
    userCreateDto.password = await Hash.generate(userCreateDto.password);
    const user = await this.userRepository.create(userCreateDto);
    return Mapper.map(user, UserResponse);
  }

  async update(
    id: string,
    userUpdateDto: UserUpdateDto,
  ): Promise<UserResponse> {
    if (!(await this.userRepository.existsById(id)))
      throw new NotFoundException('User not found');
    const user = await this.userRepository.update(id, userUpdateDto);
    return Mapper.map(user, UserResponse);
  }

  async delete(id: string): Promise<boolean> {
    if (!(await this.userRepository.existsById(id)))
      throw new NotFoundException('User not found');
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

    if (
      !user ||
      !(await Hash.compare(validatePassword.password, user.password))
    )
      throw new UnauthorizedException();

    return Mapper.map(user, UserResponse);
  }
}
