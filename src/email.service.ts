import { Inject, Injectable } from '@nestjs/common';
import { SentMessageInfo, Transporter } from 'nodemailer';
import { EmailRequest } from './dto/email-request.dto';
import { SMTP_CONFIG_OPTIONS } from './constants';
import { ConnectionFailed } from './errors/connection-failed.error';

interface IEmailService {
  sendMail(emailRequest: EmailRequest): Promise<void>;
}

@Injectable()
export class EmailService implements IEmailService {
  constructor(
    @Inject(SMTP_CONFIG_OPTIONS)
    private transporter: Transporter<SentMessageInfo>,
  ) {}

  async sendMail({
    from,
    to,
    subject,
    body,
    body_html = '',
  }: EmailRequest): Promise<void> {
    const verifier = await this.transporter.verify();

    if (!verifier)
      throw new ConnectionFailed(
        'Connection failed. Verify your credentials or connection.',
      );

    const mail = {
      from: from,
      to: to,
      subject: subject,
      text: body,
      html: body_html,
    };

    try {
      await this.transporter.sendMail(mail);
    } catch (err) {
      throw err;
    }
  }
}
