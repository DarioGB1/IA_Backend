import { UserEntity } from "src/domain/entities/user.entity";
import { UserRole } from "src/domain/shared/enum/user-role";

export class UserDto {
    constructor(
        id: string,
        avatar: string | null,
        name: string,
        lastName: string,
        email: string,
        role: UserRole,
        createdAt: Date,
        updatedAt: Date
    ) { }

    static FromEntity(user: UserEntity): UserDto {
        return new UserDto(
            user.id,
            user.avatar,
            user.name,
            user.lastName,
            user.email,
            user.role,
            user.createdAt,
            user.updatedAt
        );
    }
}