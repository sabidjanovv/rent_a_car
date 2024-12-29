import { Injectable } from '@nestjs/common';
import { CreateCarPhotoDto } from './dto/create-car_photo.dto';
import { UpdateCarPhotoDto } from './dto/update-car_photo.dto';
import { CarPhoto } from './models/car_photo.model';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from '../file/file.service';

@Injectable()
export class CarPhotoService {
  constructor(
    @InjectModel(CarPhoto) private carPhotoModel: typeof CarPhoto,
    private readonly fileService: FileService,
  ) {}

  async create(createCarPhotoDto: CreateCarPhotoDto, image: any) {
    const fileName = await this.fileService.saveFile(image);

    return this.carPhotoModel.create({
      ...createCarPhotoDto,
      url: fileName,
    });
  }

  async findAll() {
    const cars_photo = await this.carPhotoModel.findAll({ include: { all: true } });
    return {
      data: cars_photo,
      total: cars_photo.length,
    }
  }

  findOne(id: number) {
    return this.carPhotoModel.findOne({
      where: { id },
      include: { all: true },
    });
  }

  async update(
    id: number,
    updatecarPhotoDto: UpdateCarPhotoDto,
  ): Promise<CarPhoto> {
    const carPhoto = await this.carPhotoModel.update(updatecarPhotoDto, {
      where: { id },
      returning: true,
    });
    // console.log(carPhoto);
    return carPhoto[1][0];
  }

  remove(id: number) {
    return this.carPhotoModel.destroy({ where: { id } });
  }
}
