import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { SentMessageInfo, Transporter } from 'nodemailer';
import { SMTP_CONFIG_OPTIONS } from './constants';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  const transporterMock = mock<Transporter<SentMessageInfo>>();

  beforeEach(async () => {
    const smtpOptionsProvider = {
      provide: SMTP_CONFIG_OPTIONS,
      useValue: transporterMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [smtpOptionsProvider, EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should send email', async () => {
    let sendMail = false;
    transporterMock.verify.mockReturnValue(Promise.resolve(true));
    transporterMock.sendMail.mockImplementation(async () => (sendMail = true));
    await service.sendMail({
      from: 'test@test.com',
      to: 'to@to.com',
      subject: 'Email sent',
      body: 'body',
      body_html: '<p>body</p>',
    });

    expect(sendMail).toBeTruthy();
  });
});
