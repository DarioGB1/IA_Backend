import { IUserRepository } from 'src/domain/repositories/user.repository';
import { BaseMongoRepository } from './base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserModel } from '../schemas/user.schema';
import { UserEntity } from 'src/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMongoRepository
  extends BaseMongoRepository<UserEntity, UserDocument>
  implements IUserRepository
{
  constructor(@InjectModel(UserModel.name) userModel: Model<UserDocument>) {
    super(userModel);
  }

  protected toEntity(document: UserDocument): UserEntity {
    return new UserEntity({
      id: document._id,
      avatar: document.avatar!,
      name: document.name,
      lastName: document.lastName,
      email: document.email,
      password: document.password,
      role: document.role,
      emailVerified: document.emailVerified!,
      active: document.active!,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  protected toDocument(entity: Partial<UserEntity>): Partial<UserDocument> {
    const { id, ...rest } = entity;
    return {
      ...rest,
      _id: id,
    } as Partial<UserDocument>;
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    const document = await this.model.findOne({ email }).exec();
    return document ? this.toEntity(document) : null;
  }
}
