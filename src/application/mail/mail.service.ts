import { Injectable, OnModuleInit } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { MailType } from './enums/mail-type';
import { MailViews } from './views/mail-views';

interface MailOptions {
  from?: string;
  subject: string;
  to: string;
  mailType: MailType;
}

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: Transporter;

  constructor() {}

  onModuleInit() {
    this.transporter = createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendMail(
    options: MailOptions,
    code: string,
    name: string,
  ): Promise<any> {
    try {
      return await this.transporter.sendMail({
        to: options.to,
        html: MailViews.buildView(options.mailType, name, code),
        subject: options.subject,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
