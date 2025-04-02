export class UserResponseDto {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<UserResponseDto>) {
        Object.assign(this, data);
    }

    static fromEntity(entity: any): UserResponseDto {
        return new UserResponseDto({
            id: entity.id,
            email: entity.email,
            username: entity.username,
            firstName: entity.firstName,
            lastName: entity.lastName,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        });
    }
}