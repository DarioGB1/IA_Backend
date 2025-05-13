import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from "class-validator";

export class VerifyCodeDto {
    @ApiProperty({ description: 'Verification code for account activation or password reset', example: '123456' })
    @IsNotEmpty()
    @IsString()
    code: string
}