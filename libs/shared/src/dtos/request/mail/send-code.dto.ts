import { ApiProperty } from '@nestjs/swagger';
import { MailType } from '@app/shared/enums';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SendCodeDto {
  @ApiProperty({
    description: 'Email address to send the verification code to',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User name for personalized email content',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Verification code to be sent in the email',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Type of mail being sent',
    enum: MailType,
    example: MailType.Verification,
    enumName: 'MailType',
  })
  @IsNotEmpty()
  @IsEnum(MailType)
  mailType: MailType;
}
