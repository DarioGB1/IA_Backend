import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRole } from 'src/domain/shared/enum/user-role';

export class UserDto {
  constructor(
    public id: string,
    public avatar: string | null,
    public name: string,
    public lastName: string,
    public email: string,
    public role: UserRole,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static FromEntity(user: UserEntity): UserDto {
    return new UserDto(
      user.id,
      user.avatar,
      user.name,
      user.lastName,
      user.email,
      user.role,
      user.createdAt,
      user.updatedAt,
    );
  }
}
