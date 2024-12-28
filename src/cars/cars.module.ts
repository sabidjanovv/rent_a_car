import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Car } from './models/car.model';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { Booking } from '../booking/models/booking.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Car, Booking]),
    JwtModule.register({}),
    UserModule,
  ],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService, SequelizeModule],
})
export class CarsModule {}
