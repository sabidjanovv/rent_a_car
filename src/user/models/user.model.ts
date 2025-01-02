import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Booking } from '../../booking/models/booking.model';
import { Payment } from '../../payments/models/payment.model';
import { Car } from '../../cars/models/car.model';
import { Like } from '../../likes/models/like.model';
import { RentalHistory } from '../../rental_history/models/rental_history.model';

interface IUserAttr {
  full_name: string;
  login: string;
  email: string;
  phone_number: string;
  is_active: boolean;
  is_owner: boolean;
  hashed_password: string;
  hashed_refresh_token: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, IUserAttr> {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Sardor Sobidjonov',
    description: "User's full name",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @ApiProperty({
    example: 'user1234',
    description: 'Unique login for the user',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  login: string;

  @ApiProperty({
    example: 'user@gmail.com',
    description: "User's email address",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: '+998901234567',
    description: "User's phone number",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone_number: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the user is active',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_active: boolean;

  @ApiProperty({
    example: false,
    description: 'Indicates if the user is the car rental owner',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_owner: boolean;

  @ApiProperty({
    example: '$2b$10$abcdefghijklmnopqrstuv',
    description: 'Hashed password',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @ApiProperty({
    example: '$2b$10$qrstuvwxyzabcdefghi',
    description: 'Hashed refresh token',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  hashed_refresh_token: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j',
    description: 'Activation link for the user',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  activation_link: string;

  @HasMany(() => Like)
  likes: Like[];

  @HasMany(() => Car)
  cars: Car[];

  @HasMany(() => Booking)
  bookings: Booking[];

  // @HasMany(() => Payment)
  // payments: Payment[];

  @HasMany(() => RentalHistory)
  rentalHistories: RentalHistory[];
}
