import { DynamicModule, Global, Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { SMTP_TRANSPORTER } from './email/constants';
import { EmailService } from './email/email.service';
import { createTransport } from 'nodemailer';
import { SmtpOptions } from './email/interfaces/smtp-options.interface';

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
export class CzarLibModule {
  public static register(smtpOptions: SmtpOptions): DynamicModule {
    return {
      module: CzarLibModule,
      providers: [transporterFactory(smtpOptions)],
      exports: [EmailService, transporterFactory],
    };
  }
}
