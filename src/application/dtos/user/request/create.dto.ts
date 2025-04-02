import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UserCreateDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(100)
    password: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    bio?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    avatar?: string;
}