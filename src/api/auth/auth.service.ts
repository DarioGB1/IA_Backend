import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/request/login.dto';
import { Credentials } from './dto/response/credentials.dto';
import { IUserRepository, UserRepository } from 'src/domain/repositories/user.repository';
import { Hash } from 'src/utils/hash';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @Inject(UserRepository) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService
  ) { }

  async singIn(loginDto: LoginDto): Promise<Credentials> {
    const user = await this.userRepository.GetByEmail(loginDto.email);
    if (user === null) throw new Error("Invalid Credentials.")
    if (!await Hash.compare(loginDto.password, user.password)) throw new Error("Invalid Credentials.")

    const token = await this.jwtService.signAsync({ id: user.id, role: user.role });

    if (!user.emailVerified) return {
      accessToken: token,
      refreshToken: null
    }

    return {
      accessToken: token,
      refreshToken: ""
    };
  }

  async singUp(createUserDto: CreateUserDto): Promise<Credentials> {
    createUserDto.password = await Hash.generate(createUserDto.password);
    const user = await this.userRepository.Create(createUserDto);
    const token = await this.jwtService.signAsync({ id: user.id, role: user.role });
    return {
      accessToken: token,
      refreshToken: null
    };
  }


}
