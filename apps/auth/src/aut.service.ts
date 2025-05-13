import { Inject, Injectable } from '@nestjs/common';
import { IRefreshTokenRepository, REFRESH_TOKEN_REPOSITORY } from './interfaces/refresh-token.repository';
import { UserCreateDto, Credentials, Guid, MailType, Tokens, UserLogin, UserResponse, UserVerification, SendCodeDto, MAIL_MS, IDENTITY_ACCESS_MS } from '@app/shared';
import { AuthPattern, MailPattern } from '@app/shared/patterns';
import { TokenService } from './services/token/token.service';
import { RedisService } from '../../../libs/shared/src/services/redis/redis.service';
import { AccountVerificationData } from './data/redis/interfaces/account-verification-data.interface';
import { Envs } from './config/envs';
import { ClientProxy } from '@nestjs/microservices';
import { CodeGenerate } from './utils';
import { firstValueFrom } from 'rxjs';



@Injectable()
export class AuthService {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(MAIL_MS) private readonly mailMS: ClientProxy,
    @Inject(IDENTITY_ACCESS_MS) private readonly identityAccessMS: ClientProxy,
    private readonly redisService: RedisService,
    private readonly tokenService: TokenService,
  ) { }

  async login(login: UserLogin): Promise<Credentials> {
    const user: UserResponse = await firstValueFrom(this.identityAccessMS.send(AuthPattern.LOGIN, { email: login.email, password: login.password }));

    const refreshToken = await this.refreshTokenRepository.create({
      userId: user.id,
      deviceId: login.deviceId,
      ipAddress: login.ipAddress,
      expiresAt: new Date(Date.now() + Envs.REFRESH_TOKEN_EXPIRATION_TIME_IN_DAYS * 24 * 60 * 60 * 1000)
    });

    return {
      user,
      accessToken: await this.tokenService.generate({ id: user.id }),
      refreshToken: {
        value: refreshToken.id,
        expires: refreshToken.expiresAt
      },
    }
  }

  async createAccount(userCreateDto: UserCreateDto): Promise<Tokens> {
    const processId = Guid.NewGuid();
    const code = CodeGenerate.newCode();

    const sendCodeDto: SendCodeDto = {
      code,
      name: `${userCreateDto.name} ${userCreateDto.lastName}`,
      email: userCreateDto.email,
      mailType: MailType.Verification,
    };
    this.mailMS.emit(MailPattern.SEND_MAIL, sendCodeDto);

    const verificationData: AccountVerificationData = {
      code,
      processId,
      isVerifiedCode: false,
    }

    await Promise.all([
      this.redisService.set(`account:tmp:${processId}:data`, JSON.stringify(userCreateDto), 10),
      this.redisService.set(`account:tmp:${processId}:meta`, JSON.stringify(verificationData), 10),
    ]);

    return {
      accessToken: await this.tokenService.generate({ processId }, 10),
      refreshToken: null
    }
  }

  async verifyAccount(userVerification: UserVerification): Promise<Credentials> {
    const verificationData = JSON.parse(await this.redisService.get(`account:tmp:${userVerification.processId}:meta`) ?? "") as AccountVerificationData | null;

    if (!verificationData) throw Error("Not found");
    if (verificationData.isVerifiedCode) throw Error("Code used");
    if (userVerification.validationCode !== verificationData.code) throw Error("Invalid code");

    const userData = JSON.parse(await this.redisService.get(`account:tmp:${verificationData.processId}:data`) ?? "") as UserCreateDto;
    
    const user: UserResponse = await firstValueFrom(this.identityAccessMS.send(AuthPattern.CREATE_ACCOUNT, userData));

    const refreshToken = await this.refreshTokenRepository.create({
      userId: user.id,
      deviceId: userVerification.deviceId,
      ipAddress: userVerification.ipAddress,
      expiresAt: new Date(Date.now() + Envs.REFRESH_TOKEN_EXPIRATION_TIME_IN_DAYS * 24 * 60 * 60 * 1000)
    });

    await Promise.all([
      this.redisService.delete(`account:tmp:${userVerification.processId}:meta`),
      this.redisService.delete(`account:tmp:${userVerification.processId}:data`),
    ]);


    await this.redisService.set(`account:${user.id}:data`, JSON.stringify({ id: user.id }));

    return {
      user,
      accessToken: await this.tokenService.generate({ id: user.id }),
      refreshToken: {
        value: refreshToken.id,
        expires: refreshToken.expiresAt
      },
    }
  }
}
