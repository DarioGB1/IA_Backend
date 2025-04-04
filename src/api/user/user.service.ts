import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  IUserRepository,
  UserRepository,
} from 'src/domain/repositories/user.repository';
import { UserDto } from './dto/response/user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: IUserRepository,
  ) {}

  getByEmail(email: string) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async findById(id: string): Promise<UserDto> {
    const user = await this.userRepository.getById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return UserDto.FromEntity(user);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
