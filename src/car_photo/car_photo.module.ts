import { Module } from '@nestjs/common';
import { CarPhotoService } from './car_photo.service';
import { CarPhotoController } from './car_photo.controller';
import { FileModule } from '../file/file.module';
import { CarPhoto } from './models/car_photo.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([CarPhoto]), FileModule],
  controllers: [CarPhotoController],
  providers: [CarPhotoService],
})
export class CarPhotoModule {}
