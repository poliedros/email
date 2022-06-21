export interface SmtpOptionsFactory {
  createSmtpConnectOptions(): Promise<SmtpOptionsFactory> | SmtpOptionsFactory;
}
