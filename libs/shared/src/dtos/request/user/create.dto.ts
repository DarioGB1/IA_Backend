import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserCreateDto {
    @ApiProperty({ description: 'User first name', example: 'John' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'User last name', example: 'Doe' })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({ description: 'User email address', example: 'user@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User password',
        minLength: 8,
        example: 'password123'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}