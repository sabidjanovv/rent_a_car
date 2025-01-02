import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SequelizeModule } from '@nestjs/sequelize';
import { join } from 'node:path';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/models/admin.model';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { User } from './user/models/user.model';
import { CarsModule } from './cars/cars.module';
import { Car } from './cars/models/car.model';
import { BookingModule } from './booking/booking.module';
import { Booking } from './booking/models/booking.model';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/models/payment.model';
// import { BotModule } from './bot/bot.module';
// import { Bot } from './bot/models/bot.model';
import { OtpModule } from './otp/otp.module';
import { Otp } from './otp/models/otp.model';
// import { BOT_NAME } from './app.constants';
import { TelegrafModule } from 'nestjs-telegraf';
import { RentalHistoryModule } from './rental_history/rental_history.module';
import { RentalHistory } from './rental_history/models/rental_history.model';
import { CarPhotoModule } from './car_photo/car_photo.module';
import { CarPhoto } from './car_photo/models/car_photo.model';
import { LikesModule } from './likes/likes.module';
import { Like } from './likes/models/like.model';

@Module({
  imports: [
    // TelegrafModule.forRootAsync({
    //   botName: BOT_NAME,
    //   useFactory: () => ({
    //     token: process.env.BOT_TOKEN,
    //     include: [BotModule],
    //     middlewares: [],
    //   }),
    // }),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        Admin,
        User,
        Car,
        Booking,
        Payment,
        Otp,
        RentalHistory,
        CarPhoto,
        Like
      ],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false,
    }),
    AdminModule,
    AuthModule,
    UserModule,
    MailModule,
    CarsModule,
    BookingModule,
    PaymentsModule,
    // BotModule,
    OtpModule,
    RentalHistoryModule,
    CarPhotoModule,
    LikesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
