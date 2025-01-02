import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsEmail,
  Length,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateOwnerDto {
  @ApiProperty({
    description: "Owner's full name",
    example: 'Sardor Sobidjonov',
  })
  @IsString({ message: 'Full name must be a string' })
  @Length(3, 50, {
    message: 'Full name length must be between 3 and 50 characters',
  })
  full_name: string;

  @ApiProperty({
    description: 'Unique login for the Owner',
    example: 'Owner1234',
  })
  @IsString({ message: 'Login must be a string' })
  @Length(3, 20, {
    message: 'Login length must be between 3 and 20 characters',
  })
  login: string;

  @ApiProperty({
    description: "Owner's email address",
    example: 'Owner@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email address format' })
  @Length(5, 100, {
    message: 'Email length must be between 5 and 100 characters',
  })
  email: string;

  @ApiProperty({
    description: "Owner's phone number",
    example: '+998901234567',
  })
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^\+998[0-9]{9}$/, {
    message: 'Phone number must match the Uzbekistan format (+998901234567)',
  })
  phone_number: string;
}
