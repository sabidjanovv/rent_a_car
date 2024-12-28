import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsEmail, Length } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Full Name of admin',
    example: 'Sardor Sobidjonov',
  })
  @IsString({ message: 'Full name must be a string' })
  @Length(3, 50, {
    message: 'Full name length must be between 3 and 50 characters',
  })
  full_name: string;

  @ApiProperty({ description: 'Unique login of admin', example: 'admin1234' })
  @IsString({ message: 'Login must be a string' })
  @Length(3, 20, {
    message: 'Login length must be between 3 and 20 characters',
  })
  login: string;

  @ApiProperty({
    description: 'Email address of admin',
    example: 'admin@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email address format' })
  @Length(5, 100, {
    message: 'Email length must be between 5 and 100 characters',
  })
  email: string;

  @ApiProperty({ description: 'Password', example: 'P@ssw0rd' })
  @IsString({ message: 'Password must be a string' })
  @Length(8, 100, {
    message: 'Password length must be at least 8 characters',
  })
  password: string;

  @ApiProperty({ description: 'Confirm Password', example: 'P@ssw0rd' })
  @IsString({ message: 'Confirm password must be a string' })
  @Length(8, 100, {
    message: 'Confirm password length must be at least 8 characters',
  })
  confirm_password: string;

  @ApiProperty({ description: 'Admin active status', default: true })
  @IsBoolean({ message: "Active status must be 'true' or 'false'" })
  is_active?: boolean;
}
