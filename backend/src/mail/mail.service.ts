import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(
      {
        host: process.env.MAILER_HOST,
        secure: true,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASSWORD,
        },
      },
      {
        from: `Streamly ${process.env.MAILER_USER}`,
      },
    );
  }

  async sendMail(mailOptions: nodemailer.SendMailOptions) {
    return this.transporter.sendMail(mailOptions);
  }
}
