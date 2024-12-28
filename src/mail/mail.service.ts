import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { User } from "../user/models/user.model";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(user: User) {
    const url = `${process.env.API_URL}:${process.env.PORT}/api/auth/activate/${user.activation_link}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Rent a Car'ga xush kelibsiz",
      template: './confirm',
      context: {
        full_name: user.full_name,
        url,
      },
    });
  }

  async sendOtp(email: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Sizning OTP kodingiz',
        template: './otp',
        context: {
          otp,
        },
      });
      return true;
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return false;
    }
  }

  //   async sendMailCustomer(customer:Customer){
  //     const url = `${process.env.API_URL}:${process.env.PORT}/api/auth/activate-customer/${customer.activation_link}`;
  //     await this.mailerService.sendMail({
  //       to: customer.email,
  //       subject: "Rent a Car'ga xush kelibsiz",
  //       template: "./confirm",
  //       context: {
  //         full_name: customer.full_name,
  //         url,
  //       },
  //     });
  //   }
}
