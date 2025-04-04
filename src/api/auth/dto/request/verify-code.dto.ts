import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyCodeDto {
  @ApiProperty({
    description: 'Verification code sent to the user',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
