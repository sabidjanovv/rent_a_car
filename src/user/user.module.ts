import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
// import { BotModule } from '../bot/bot.module';
import { OtpModule } from '../otp/otp.module';
import { Otp } from '../otp/models/otp.model';
// import { Bot } from '../bot/models/bot.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Otp]),
    JwtModule.register({}),
    MailModule,
    // BotModule,
    OtpModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, SequelizeModule],
})
export class UserModule {}
