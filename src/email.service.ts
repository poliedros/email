import { Inject, Injectable } from '@nestjs/common';
import { SentMessageInfo, Transporter } from 'nodemailer';
import { SMTP_CONFIG_OPTIONS } from './constants';

interface IEmailService {
  sendMail(
    from: string,
    to: string,
    subject: string,
    body: string,
    body_html: string,
  ): Promise<void>;
}

@Injectable()
export class EmailService implements IEmailService {
  constructor(
    @Inject(SMTP_CONFIG_OPTIONS)
    private transporter: Transporter<SentMessageInfo>,
  ) {}

  async sendMail(
    from: string,
    to: string,
    subject: string,
    body: string,
    body_html: string,
  ): Promise<void> {
    const mail = {
      from: from,
      to: to,
      subject: subject,
      text: body,
      html: body_html,
    };

    await this.transporter.sendMail(mail);
  }
}
