import { Injectable, OnModuleInit } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { MailViews } from './views/mail-view';
import { MailType } from '@app/shared';
import { Envs } from './config';

interface MailOptions {
  from?: string;
  subject: string;
  to: string;
  mailType: MailType;
}

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: Transporter;

  onModuleInit() {
    try {
      this.transporter = createTransport({
        host: Envs.MAIL_HOST,
        port: Envs.MAIL_PORT,
        auth: {
          user: Envs.MAIL_USERNAME,
          pass: Envs.MAIL_PASSWORD,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to create mail transporter:', error.message);
      } else {
        console.error('Unknown error creating mail transporter:', error);
      }
    }
  }

  async sendVerificationMail(
    options: MailOptions,
    code: string,
    name: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        to: options.to,
        html: MailViews.buildView(options.mailType, name, code),
        subject: options.subject,
      });
    } catch (error: unknown) {
      console.error('Error sending email:', error);
    }
  }
}
