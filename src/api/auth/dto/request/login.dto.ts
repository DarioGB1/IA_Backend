import { ApiProperty } from '@nestjs/swagger';  // Importar decorador de Swagger
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'The email address of the user',
        example: 'john.doe@example.com', // Ejemplo de datos para Swagger
    })
    @IsString({ message: 'Email must be string' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'securePassword123', // Ejemplo de datos para Swagger
    })
    @IsString({ message: 'Password must be string' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
