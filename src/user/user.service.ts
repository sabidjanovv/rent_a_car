import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { MailService } from '../mail/mail.service';
import * as uuid from 'uuid';

import * as otpGenerator from 'otp-generator';
// import { PhoneUserDto } from './dto/phone-user.dto';
import { EmailUserDto } from './dto/email-user.dto';
// import { BotService } from '../bot/bot.service';
import { Otp } from '../otp/models/otp.model';
import { AddMinutesToDate } from '../helpers/addMinutes';
import { decode, encode } from '../helpers/crypto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Otp) private otpModel: typeof Otp,
    private readonly mailService: MailService,
    // private readonly botService: BotService,
  ) {}

  async findAll() {
    const users = await this.userModel.findAll({ include: { all: true } });
    return {
      data: users,
      total: users.length,
    };
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new BadRequestException(
        `User with ID: ${id} not found. (ID: ${id} bo'lgan foydalanuvchi topilmadi.)`,
      );
    }

    return this.userModel.findOne({ where: { id }, include: { all: true } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // try {
      // const activation_link = uuid.v4();
      const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new BadRequestException(`ID:${id} user does not exists!`);
    }
    if(!user.is_owner){
      const updatedFields = { ...updateUserDto, is_owner: false };
      const updatedUser = await this.userModel.update(updatedFields, {
        where: { id },
        returning: true,
      });
      return updatedUser[1][0];
    }else{
      const updatedFields = { ...updateUserDto};
      const updatedUser = await this.userModel.update(updatedFields, {
        where: { id },
        returning: true,
      });
      return updatedUser[1][0];
    }

      // const [updatedCount, updatedUsers] = await this.userModel.update(
      //   { ...updateUserDto },
      //   { where: { id }, returning: true },
      // );

      // if (updatedCount === 0) {
      //   throw new BadRequestException(`User with ID: ${id} not found.`);
      // }

      // const updatedUser = updatedUsers[0];

      // try {
      //   await this.mailService.sendMail(updatedUser);
      // } catch (mailError) {
      //   console.error(
      //     'Mail Sending Error (Xat yuborishda xatolik):',
      //     mailError,
      //   );
      //   throw new BadRequestException(
      //     'Error occurred while sending the email!',
      //   );
      // }

    //   return {
    //     message:
    //       'Successfully updated!',
    //     data: updatedUser
    //   };
    // } catch (error) {
    //   console.error('Update Error:', error);

    //   throw new BadRequestException(
    //     'An error occurred during the update process!',
    //   );
    // }
  }

  async remove(id: number) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      return { message: `ID: ${id} user does not exists!` };
    }
    await this.userModel.destroy({ where: { id } });
    return {
      message: `User with ID: ${id} successfully deleted.`,
    };
  }

  // // =========================== OTP TG ==========================

  // async newOtp(phoneUserDto: PhoneUserDto) {
  //   const phone_number = phoneUserDto.phone_number;

  //   const otp = otpGenerator.generate(4, {
  //     upperCaseAlphabets: false,
  //     lowerCaseAlphabets: false,
  //     specialChars: false,
  //   });
  //   // //BOT
  //   const isSend = await this.botService.sendOtp(phone_number, otp);

  //   if (!isSend) {
  //     throw new BadRequestException("Avval botdan ro'yxattan o'ting");
  //   }

  //   // //SMS
  //   // const response = await this.smsService.sendSms(phone_number, otp);

  //   // if (response.status !== 200) {
  //   //   throw new ServiceUnavailableException('OTP yubborishda xatolik');
  //   // }

  //   const message =
  //     `OTP code has been send to ****` +
  //     phone_number.slice(phone_number.length - 4);

  //   const now = new Date();
  //   const expiration_time = AddMinutesToDate(now, 5);
  //   await this.otpModel.destroy({ where: { phone_number } });

  //   const newOtp = await this.otpModel.create({
  //     id: uuid.v4(),
  //     otp,
  //     expiration_time,
  //     phone_number,
  //   });
  //   const details = {
  //     timestamp: now,
  //     phone_number,
  //     otp_id: newOtp.id,
  //   };
  //   const encodedData = await encode(JSON.stringify(details));

  //   return { message, details: encodedData };
  // }

  // async verifyOtp(verifyOtpDto: VerifyOtpDto) {
  //   const { verification_key, otp, phone_number } = verifyOtpDto;
  //   const currentDate = new Date();
  //   const decodedData = await decode(verification_key);
  //   const details = JSON.parse(decodedData);
  //   if (details.phone_number != phone_number) {
  //     throw new BadRequestException('OTP bu raqamga yuborilmagan');
  //   }
  //   const resultOtp = await this.otpModel.findOne({
  //     where: { id: details.otp_id },
  //   });
  //   if (!resultOtp) {
  //     throw new BadRequestException('Bunday OTP mavjud emas');
  //   }

  //   if (resultOtp.verified) {
  //     throw new BadRequestException('Bu OTP avval tekshirilgan');
  //   }

  //   if (resultOtp.expiration_time < currentDate) {
  //     throw new BadRequestException('Bu OTPning vaqti tugagan');
  //   }

  //   if (resultOtp.otp !== otp) {
  //     throw new BadRequestException('OTP mos emas');
  //   }

  //   const user = await this.userModel.update(
  //     {
  //       is_owner: true,
  //     },
  //     {
  //       where: { phone_number: `+${phone_number}` },
  //       returning: true,
  //     },
  //   );
  //   if (!user[1][0]) {
  //     throw new BadRequestException("Bunday foydalanuvchi yo'q");
  //   }
  //   await this.otpModel.update(
  //     { verified: true },
  //     { where: { phone_number: `+${phone_number}` } },
  //   );
  //   const response = {
  //     message: "Siz owner bo'ldingiz",
  //     owner: user[1][0].is_owner,
  //   };
  //   return response;
  // }

  // ============== OTP EMAIL =====
  async newOtp(email: string): Promise<{ message: string; details: string }> {
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException(`Email ${email} does not exists!`);
    } else if (user.is_owner === true) {
      throw new BadRequestException('User already owner!');
    }

    const isSend = await this.mailService.sendOtp(email, otp);

    if (!isSend) {
      throw new BadRequestException('OTP yuborishda xatolik yuz berdi.');
    }

    const now = new Date();
    const expiration_time = new Date(now.getTime() + 5 * 60000); // 5 minutes

    await this.otpModel.destroy({ where: { email } });

    const newOtp = await this.otpModel.create({
      id: uuid.v4(),
      otp,
      expiration_time,
      email,
    });

    const encodedData = Buffer.from(
      JSON.stringify({
        email,
        otp_id: newOtp.id,
        timestamp: now,
      }),
    ).toString('base64');

    return {
      message: `OTP code has been sent to ${email}`,
      details: encodedData,
    };
  }

  async verifyOtp(
    verification_key: string,
    otp: string,
    email: string,
  ): Promise<any> {
    const decodedData = JSON.parse(
      Buffer.from(verification_key, 'base64').toString('ascii'),
    );

    if (decodedData.email !== email) {
      throw new BadRequestException('Bu email uchun OTP yuborilmagan.');
    }

    const otpRecord = await this.otpModel.findOne({
      where: { id: decodedData.otp_id },
    });

    if (!otpRecord) {
      throw new BadRequestException('OTP mavjud emas.');
    }

    if (otpRecord.verified) {
      throw new BadRequestException('Bu OTP avval tekshirilgan.');
    }

    if (otpRecord.expiration_time < new Date()) {
      throw new BadRequestException('OTPning vaqti tugagan.');
    }

    if (otpRecord.otp !== otp) {
      throw new BadRequestException('OTP mos emas.');
    }

    await this.otpModel.update({ verified: true }, { where: { email } });

    await this.userModel.update({ is_owner: true }, { where: { email } });

    return { message: "OTP tasdiqlandi, siz endi owner bo'ldingiz." };
  }
}
