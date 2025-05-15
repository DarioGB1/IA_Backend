import { Module } from '@nestjs/common';
import { REFRESH_TOKEN_REPOSITORY } from '../interfaces/refresh-token.repository';
import { MongoRefreshTokenRepository } from './mongo/refresh-token/refresh-token.repository';
import { RedisModule } from '@app/shared';
import { Envs } from '../config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoRefreshTokenModule } from './mongo/refresh-token/refresh-token.module';

@Module({
  imports: [
    MongooseModule.forRoot(Envs.DATABASE_URL, {
      dbName: Envs.DATABASE_NAME,
    }),
    RedisModule.register(Envs.REDIS_URL),
    MongoRefreshTokenModule,
  ],
  providers: [
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: MongoRefreshTokenRepository,
    },
  ],
  exports: [REFRESH_TOKEN_REPOSITORY, RedisModule],
})
export class DataModule {}
