import { ApiProperty } from '@nestjs/swagger';  // Importar decorador de Swagger
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/domain/shared/enum/user-role';

export class CreateUserDto {
    @ApiProperty({
        description: 'The first name of the user',
        example: 'John',  // Ejemplo de dato para Swagger
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The last name of the user',
        example: 'Doe',  // Ejemplo de dato para Swagger
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'john.doe@example.com',  // Ejemplo de dato para Swagger
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'securePassword123',  // Ejemplo de dato para Swagger
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'Role of the user',
        enum: UserRole,  // Enum para los roles de usuario
        example: UserRole.Student,  // Ejemplo de valor para Swagger
    })
    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole;

    @IsString()
    @IsOptional()
    avatar?: string;
}
