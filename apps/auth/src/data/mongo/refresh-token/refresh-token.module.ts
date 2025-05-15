import { Module } from '@nestjs/common';
import { MongoRefreshTokenRepository } from './refresh-token.repository';
import { RefreshToken, RefreshTokenSchema } from './refresh-token.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema,
      },
    ]),
  ],
  providers: [MongoRefreshTokenRepository],
  exports: [MongoRefreshTokenRepository, MongooseModule],
})
export class MongoRefreshTokenModule {}
