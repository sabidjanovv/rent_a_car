import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminModule } from '../admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from '../admin/models/admin.model';
import { User } from '../user/models/user.model';
import { MailModule } from '../mail/mail.module';
// import { Customer } from '../customer/models/customer.model';
@Module({
  imports: [
    SequelizeModule.forFeature([Admin, User]),
    JwtModule.register({}),
    MailModule,

  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
