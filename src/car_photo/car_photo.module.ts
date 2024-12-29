import { Module } from '@nestjs/common';
import { CarPhotoService } from './car_photo.service';
import { CarPhotoController } from './car_photo.controller';
import { FileModule } from '../file/file.module';
import { CarPhoto } from './models/car_photo.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([CarPhoto]),
    // JwtModule.register({}),
    FileModule,
    // UserModule,
  ],
  controllers: [CarPhotoController],
  providers: [CarPhotoService],
  exports: [CarPhotoService, SequelizeModule],
})
export class CarPhotoModule {}
