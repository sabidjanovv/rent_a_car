import { Module } from '@nestjs/common';
import { RentalHistoryService } from './rental_history.service';
import { RentalHistoryController } from './rental_history.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { RentalHistory } from './models/rental_history.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([RentalHistory]),
    JwtModule.register({}),
  ],
  controllers: [RentalHistoryController],
  providers: [RentalHistoryService],
  exports: [RentalHistoryService, SequelizeModule],
})
export class RentalHistoryModule {}
