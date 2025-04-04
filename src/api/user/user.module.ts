import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserMongoRepository } from 'src/infrastructure/mongo/repositories/user.repository';
import {
  UserModel,
  UserSchema,
} from 'src/infrastructure/mongo/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

const userRepository = {
  provide: UserRepository,
  useClass: UserMongoRepository,
};

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [userRepository, UserService],
  exports: [userRepository],
})
export class UserModule {}
