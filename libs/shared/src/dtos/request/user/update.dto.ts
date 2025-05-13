import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from "class-validator";

export class UserUpdateDto {
    @ApiProperty({ description: 'User profile image URL', required: false })
    @IsOptional()
    @IsString()
    profileImg?: string
}