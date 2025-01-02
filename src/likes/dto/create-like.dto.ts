import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateLikeDto {
  @ApiProperty({
    example: 1,
    description: 'car ID',
  })
  @IsNotEmpty({ message: "car ID bo'sh bo'lmasligi kerak" })
  @IsNumber({}, { message: "car ID raqam bo'lishi kerak" })
  car_id: number;

  @ApiProperty({
    example: 1,
    description: 'customer ID',
  })
  @IsNotEmpty({ message: "customer ID bo'sh bo'lmasligi kerak" })
  @IsNumber({}, { message: "customer ID raqam bo'lishi kerak" })
  user_id: number;
}
