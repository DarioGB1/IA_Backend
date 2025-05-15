import { Guid } from '@app/shared';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User {
  @Prop({ type: String, default: () => Guid.NewGuid() })
  _id: string;

  @Prop({ type: String, default: null })
  profileImg: string | null;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Boolean, default: true })
  active: boolean;
}

export type UserDocument = HydratedDocument<User> & {
  createdAt: Date;
  updatedAt: Date;
};
export const UserSchema = SchemaFactory.createForClass(User);
