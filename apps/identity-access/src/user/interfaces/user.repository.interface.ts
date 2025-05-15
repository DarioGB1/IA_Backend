import { IBaseRepository } from '@app/shared/interfaces';
import { UserCreateDto, UserUpdateDto } from '@app/shared';
import { UserEntity } from '../user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';
export interface IUserRepository
  extends IBaseRepository<UserEntity, UserCreateDto, UserUpdateDto> {
  getByEmail(email: string): Promise<UserEntity | null>;
}
