import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCarPhotoDto {
  @ApiProperty({ example: 1, description: 'Carning Id raqami' })
  car_id: number;

  @ApiProperty({
    example: 'photo.jpg',
    description: 'Rasmning URLi yoki fayldan yuklash',
  })
  @IsString()
  @IsOptional()
  url: string;
}
