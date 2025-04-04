import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/request/login.dto';
import { Credentials } from './dto/response/credentials.dto';
import {
  IUserRepository,
  UserRepository,
} from 'src/domain/repositories/user.repository';
import { Hash } from 'src/utils/hash';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/application/mail/mail.service';
import { MailType } from 'src/application/mail/enums/mail-type';
import { CodeGenerate } from 'src/utils/code';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async singIn(loginDto: LoginDto): Promise<Credentials> {
    const user = await this.userRepository.getByEmail(loginDto.email);
    if (user === null) throw new Error('Invalid Credentials.');
    if (!(await Hash.compare(loginDto.password, user.password)))
      throw new Error('Invalid Credentials.');

    const token = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
    });

    if (!user.emailVerified)
      return {
        accessToken: token,
      };

    return {
      accessToken: token,
    };
  }

  async singUp(createUserDto: CreateUserDto): Promise<Credentials> {
    createUserDto.password = await Hash.generate(createUserDto.password);
    const user = await this.userRepository.create(createUserDto);
    const code = CodeGenerate.newCode();
    this.mailService.sendMail(
      {
        mailType: MailType.Register,
        to: user.email,
        subject: 'Validacion de cuenta',
      },
      code,
      `${user.name} ${user.lastName}`,
    );
    const token = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
      code,
    });
    return {
      accessToken: token,
    };
  }

  async validateAccount(id: string) {
    await this.userRepository.update(id, { emailVerified: true });
  }
}
