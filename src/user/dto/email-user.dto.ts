import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsEmail,
  Length,
  Matches,
  IsOptional,
} from 'class-validator';

export class EmailUserDto {
  @ApiProperty({
    description: "User's email address",
    example: 'user@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email address format' })
  @Length(5, 100, {
    message: 'Email length must be between 5 and 100 characters',
  })
  email: string;
}
