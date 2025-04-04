import { UserEntity } from '../entities/user.entity';
import { IBaseRepository } from './base.repository';

export const UserRepository = 'UserRepository';
export interface IUserRepository extends IBaseRepository<UserEntity> {
  getByEmail(email: string): Promise<UserEntity | null>;
}
