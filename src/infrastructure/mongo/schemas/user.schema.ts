import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from 'src/domain/shared/enum/user-role';
import { Guid } from 'src/utils/guid';

export type UserDocument = HydratedDocument<UserModel> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({
  collection: 'users',
  timestamps: true,
})
export class UserModel {
  @Prop({ type: String, default: () => Guid.NewGuid() })
  _id: string;

  @Prop({ type: String, default: null })
  avatar?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: String, enum: Object.values(UserRole), required: true })
  role: UserRole;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false })
  emailVerified?: boolean;

  @Prop({ default: true })
  active?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
