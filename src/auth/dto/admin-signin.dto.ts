import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'adminlogin1234',
    description: 'Login username for signing in',
  })
  @IsNotEmpty({ message: 'Login field is required' })
  @IsString({ message: 'Login must be a string' })
  @MinLength(4, { message: 'Login must be at least 4 characters long' })
  @MaxLength(30, { message: 'Login must not exceed 30 characters' })
  readonly login: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password for authentication',
  })
  @IsNotEmpty({ message: 'Password field is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  readonly password: string;
}
