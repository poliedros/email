import { DynamicModule, Global, Module } from '@nestjs/common';
import { EMAIL_SERVICE } from './constants';
import { EmailService } from './email.service';
import { createTransport } from 'nodemailer';
import { SmtpOptions } from './interfaces/smtp-options.interface';

@Global()
@Module({})
export class EmailModule {
  public static forRoot(smtpOptions: SmtpOptions): DynamicModule {
    const transporter = createTransport({
      host: 'smtp.czar.dev',
      port: 465,
      auth: {
        user: smtpOptions.email,
        pass: smtpOptions.password,
      },
    });

    const emailService = new EmailService(transporter);

    const emailServiceProvider = {
      provide: EMAIL_SERVICE,
      useValue: emailService,
    };

    return {
      module: EmailModule,
      providers: [emailServiceProvider],
      exports: [EmailService],
      global: true,
    };
  }
}
