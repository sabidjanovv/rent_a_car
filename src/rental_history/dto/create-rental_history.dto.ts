import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsPositive,
} from 'class-validator';

export class CreateRentalHistoryDto {
  @ApiProperty({ example: 1, description: 'ID of the rented car' })
  @IsNotEmpty({ message: 'Car ID is required' })
  @IsNumber({}, { message: 'Car ID must be a number' })
  car_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the customer who rented the car',
  })
  @IsNotEmpty({ message: 'Customer ID is required' })
  @IsNumber({}, { message: 'Customer ID must be a number' })
  owner_id: number;
  
  @ApiProperty({
    example: 1,
    description: 'ID of the customer who rented the car',
  })
  @IsNotEmpty({ message: 'Customer ID is required' })
  @IsNumber({}, { message: 'Customer ID must be a number' })
  customer_id: number;

  @ApiProperty({
    example: '2024-05-10',
    description: 'Start date of the rental period',
  })
  @IsNotEmpty({ message: 'Rental start date is required' })
  @IsDateString({}, { message: 'Rental start date must be a valid date' })
  rental_start: string;

  @ApiProperty({
    example: '2024-05-15',
    description: 'End date of the rental period',
  })
  @IsNotEmpty({ message: 'Rental end date is required' })
  @IsDateString({}, { message: 'Rental end date must be a valid date' })
  rental_end: string;

  @ApiProperty({
    example: 500.0,
    description: 'Total price of the rental',
  })
  @IsNotEmpty({ message: 'Total price is required' })
  @IsNumber({}, { message: 'Total price must be a number' })
  @IsPositive({ message: 'Total price must be a positive number' })
  total_price: number;
}
