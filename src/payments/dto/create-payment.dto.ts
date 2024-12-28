import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDateString, IsEnum, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    example: 1,
    description: 'booking ID associated with this payment',
  })
  @IsNotEmpty({ message: "booking ID bo'sh bo'lmasligi kerak" })
  @IsNumber({}, { message: "booking ID raqam bo'lishi kerak" })
  booking_id: number;

  @ApiProperty({
    example: 100000,
    description: 'Amount of the payment',
  })
  @IsNotEmpty({ message: "Payment amount bo'sh bo'lmasligi kerak" })
  @IsNumber({}, { message: "Payment amount raqam bo'lishi kerak" })
  payment_amount: number;

  //   @ApiProperty({
  //     example: '2024-11-01',
  //     description: 'Date when the payment was made',
  //   })
  //   @IsNotEmpty({ message: "Payment date bo'sh bo'lmasligi kerak" })
  //   @IsDateString(
  //     {},
  //     {
  //       message:
  //         "Payment date to'g'ri sana formatida bo'lishi kerak (YYYY-MM-DD)",
  //     },
  //   )
  //   payment_date: string;

  @ApiProperty({
    example: 'credit_card',
    description: 'Type of payment method',
    enum: ['credit_card', 'cash'],
  })
  @IsNotEmpty({ message: "Payment type bo'sh bo'lmasligi kerak" })
  @IsEnum(['credit_card', 'cash'], {
    message: "Payment type noto'g'ri qiymatga ega",
  })
  payment_type: 'credit_card' | 'cash';

  @ApiProperty({ example: '1000 USD', description: 'Garov summasi' })
  @IsString()
  pledge: string;
}
