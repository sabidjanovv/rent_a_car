import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, IsEnum, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 1, description: 'Mijozning ID raqami' })
  @IsNotEmpty({ message: "customer_id bo'sh bo'lishi mumkin emas" })
  @IsNumber({}, { message: "customer_id raqam bo'lishi kerak" })
  customer_id: number;

  @ApiProperty({ example: 1, description: 'Avtomobilning ID raqami' })
  @IsNotEmpty({ message: "car_id bo'sh bo'lishi mumkin emas" })
  @IsNumber({}, { message: "car_id raqam bo'lishi kerak" })
  car_id: number;

  @ApiProperty({ example: '2023-12-01', description: 'Boshlanish sanasi' })
  @IsNotEmpty({ message: "start_date bo'sh bo'lishi mumkin emas" })
  @IsDateString({}, { message: "start_date sana formatida bo'lishi kerak" })
  start_date: string;

  @ApiProperty({ example: '2023-12-10', description: 'Tugash sanasi' })
  @IsNotEmpty({ message: "end_date bo'sh bo'lishi mumkin emas" })
  @IsDateString({}, { message: "end_date sana formatida bo'lishi kerak" })
  end_date: string;
}
