import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ActivationNotification } from '../types/activation-notification';
import {
  activationMail,
  dateUpdateNotificationMail,
  isDocsChangeMail,
  passwordChangeMail,
} from '../emails';
import { PasswordChangeNotification } from '../types/password-change-notification';
import { DocsNotification } from '../types/docs-notification';
import { DateNotification } from '../types/date-update-notification';
import { OutDateNotification } from '../types/out-date-notification';
import { outDateNotificationMail } from '../emails/out-date-notification.mail';
import { docMail } from '../emails/doc-mail';
dotenv.config();
class MailService {
  private transporter: Transporter;
  constructor() {
    const options: SMTPTransport.Options = {
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT), // Ensure the port is a number
      secure: false, // Use true if you are using SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // This allows self-signed certificates, if needed
      },
    };

    this.transporter = nodemailer.createTransport(options);
  }

  async testEmail() {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Test Email',
        text: 'Hello World',
      });
    } catch (error) {
      console.log(error);
    } finally {
      await this.transporter.close();
    }
  }

  async activationEmail(notification: ActivationNotification) {
    const { user, link } = notification;
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Активация аккаунта на CONTEYENER',
      html: activationMail(user, link),
    };
    await this.sendMail(mailOptions);
  }

  async passwordChangeEmail(notification: PasswordChangeNotification) {
    const { user, link } = notification;
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Смена пароля на CONTEYENER',
      html: passwordChangeMail(user, link),
    };
    await this.sendMail(mailOptions);
  }

  async docsNotification(notification: DocsNotification) {
    const { changes, order_number, emails } = notification;

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: emails.join(','),
      subject: 'Изменения в документах на CONTEYENER',
      html: isDocsChangeMail({ changes, order_number }),
    };
    await this.sendMail(mailOptions);
  }

  async dateNotification(data: DateNotification) {
    const { emails, notification } = data;

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: emails.join(','),
      subject: 'Изменения в датах на CONTEYENER',
      html: dateUpdateNotificationMail(notification),
    };
    await this.sendMail(mailOptions);
  }

  async outDateNotification(data: OutDateNotification) {
    const { emails, out_dates, container_number } = data;

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: emails.join(','),
      subject: 'Опоздание в датах на CONTEYENER',
      html: outDateNotificationMail(container_number, out_dates),
    };
    await this.sendMail(mailOptions);
  }

  async notifyDs(data: any) {
    const { emails, order_number } = data;
    console.log(data);
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: emails.join(','),
      subject: `Уведомления ДС ${order_number}`,
      html: docMail(order_number, 'Д/С для подачи'),
    };
    await this.sendMail(mailOptions);
  }

  async notifyBl(data: any) {
    const { emails, order_number } = data;
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: emails.join(','),
      subject: `Уведомления BL/СМГС/CMR ${order_number}`,
      html: docMail(order_number, 'BL/СМГС/CMR'),
    };
    await this.sendMail(mailOptions);
  }

  protected async sendMail(mailOptions: nodemailer.SendMailOptions) {
    return await this.transporter.sendMail(mailOptions);
  }
}

export default MailService;
