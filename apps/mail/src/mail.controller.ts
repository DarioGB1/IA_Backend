import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailPattern, SendCodeDto } from '@app/shared';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @EventPattern(MailPattern.SEND_MAIL)
  sendMail(@Payload() sendCodeDto: SendCodeDto) {
    return this.mailService.sendVerificationMail(
      {
        mailType: sendCodeDto.mailType,
        to: sendCodeDto.email,
        subject: "Test"
      },
      sendCodeDto.code,
      sendCodeDto.name
    );
  }
}
