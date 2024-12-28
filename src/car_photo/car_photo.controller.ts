import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CarPhotoService } from './car_photo.service';
import { CreateCarPhotoDto } from './dto/create-car_photo.dto';
import { CarPhoto } from './models/car_photo.model';
import { UpdateCarPhotoDto } from './dto/update-car_photo.dto';

@ApiTags('Obyekt rasmlari')
@Controller('car-photo')
export class CarPhotoController {
  constructor(private readonly carPhotoService: CarPhotoService) {}

  @ApiOperation({ summary: 'Obyekt Idsi va rasmini qoshish' })
  @ApiResponse({
    status: 201,
    description: 'Obyekt IDsi orqali obyekt rasmlarini qoshish',
    type: String,
  })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createCarPhotoDto: CreateCarPhotoDto,
    @UploadedFile() image: any,
  ) {
    console.log(image);

    return this.carPhotoService.create(createCarPhotoDto, image);
  }

  @ApiOperation({ summary: 'Obyekt rasmlarini olish' })
  @ApiResponse({
    status: 200,
    description: 'Obyekt rasmlarini olish',
    type: CarPhoto,
  })
  @Get()
  findAll() {
    return this.carPhotoService.findAll();
  }

  @ApiOperation({ summary: "Obyekt rasmlarini ko'rish" })
  @ApiResponse({
    status: 200,
    description: "Obyekt ID si orqali obyekt rasmlarini ko'rish",
    type: CarPhoto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carPhotoService.findOne(+id);
  }

  @ApiOperation({ summary: 'Obyekt rasmlarini tahrirlash' })
  @ApiResponse({
    status: 200,
    description: 'Obyekt ID si orqali obyekt rasmlarini tahrirlash',
    type: CarPhoto,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCarPhotoDto: UpdateCarPhotoDto,
  ) {
    return this.carPhotoService.update(+id, updateCarPhotoDto);
  }

  @ApiOperation({ summary: "Obyekt rasmlarini o'chirish" })
  @ApiResponse({
    status: 200,
    description: "Obyekt ID si orqali obyekt rasmlarini o'chirish",
    type: CarPhoto,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carPhotoService.remove(+id);
  }
}
