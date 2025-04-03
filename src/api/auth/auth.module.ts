import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from 'src/infrastructure/mongo/schemas/user.schema';
import { UserMongoRepository } from 'src/infrastructure/mongo/repositories/user.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]), JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: +process.env.JWT_EXPIRATION_TIME_IN_MINUTES! * 60,
    },
  })],
  controllers: [AuthController],
  providers: [AuthService, {
    provide: UserRepository,
    useClass: UserMongoRepository
  }],
})
export class AuthModule { }
