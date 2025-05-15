import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Envs } from '../../config/envs';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtModule.register({
      secret: Envs.JWT_SECRET,
      signOptions: {
        expiresIn: Envs.JWT_EXPIRATION_TIME_IN_MINUTES * 60,
      },
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
