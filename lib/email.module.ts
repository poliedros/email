import { DynamicModule, Global, Module } from '@nestjs/common';
import { SMTP_TRANSPORTER } from './constants';
import { EmailService } from './email.service';
import { createTransport } from 'nodemailer';
import { SmtpOptions } from './interfaces/smtp-options.interface';

export const transporterFactory = (smtpOptions: SmtpOptions) => ({
  provide: SMTP_TRANSPORTER,
  useFactory: () => {
    return createTransport({
      host: 'smtp.czar.dev',
      port: 465,
      auth: {
        user: smtpOptions.email,
        pass: smtpOptions.password,
      },
    });
  },
  inject: [EmailService],
});

@Global()
@Module({
  imports: [EmailModule],
})
export class EmailModule {
  public static register(smtpOptions: SmtpOptions): DynamicModule {
    return {
      module: EmailModule,
      providers: [transporterFactory(smtpOptions)],
      exports: [EmailService, transporterFactory],
    };
  }
}
