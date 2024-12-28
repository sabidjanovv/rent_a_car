import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './models/payment.model';
import { JwtModule } from '@nestjs/jwt';
import { BookingModule } from '../booking/booking.module';
import { CarsModule } from '../cars/cars.module';
import { RentalHistoryModule } from '../rental_history/rental_history.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Payment]),
    JwtModule.register({}),
    BookingModule,
    RentalHistoryModule,
    CarsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
