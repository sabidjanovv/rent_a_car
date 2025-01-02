import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
// import { Booking } from '../../booking/models/booking.model';
// import { RentalHistory } from '../../rental_history/models/rental_history.model';
// import { Comment } from '../../comments/models/comment.model';
import { User } from '../../user/models/user.model';
import { Booking } from '../../booking/models/booking.model';
import { RentalHistory } from '../../rental_history/models/rental_history.model';
import { CarPhoto } from '../../car_photo/models/car_photo.model';

export interface ICarAttr {
  id?: number; // Optional, as it will be auto-incremented
  brand: string;
  model: string;
  year: string;
  car_number: string;
  status: 'booked' | 'busy' | 'free';
  daily_price: number;
  color: string;
  fuel_type: 'benzin' | 'metan' | 'electric' | 'hybrid';
  car_type: 'mechanic' | 'automatic';
  description?: string;
  user_id: number;
}

@Table({ tableName: 'cars' })
export class Car extends Model<Car, ICarAttr> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: 'Toyota', description: 'Car brand' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  brand: string;

  @ApiProperty({ example: 'Camry', description: 'Car model' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  model: string;

  @ApiProperty({ example: '2022', description: 'Manufacturing year' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  year: string;

  // @ApiProperty({ example: 'AA1234BB', description: 'Car number' })
  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  // car_number: string;

  @ApiProperty({ example: 'booked', description: 'Car status' })
  @Column({
    type: DataType.ENUM('booked', 'busy', 'free'),
    defaultValue: 'free',
  })
  status: 'free' | 'booked' | 'busy';

  @ApiProperty({ example: 500000, description: 'Daily rental price' })
  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  daily_price: number;

  @ApiProperty({ example: 'White', description: 'Car color' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  color: string;

  @ApiProperty({ example: 'benzin', description: 'Fuel type' })
  @Column({
    type: DataType.ENUM('benzin', 'metan', 'electric', 'hybrid'),
    allowNull: false,
  })
  fuel_type: 'benzin' | 'metan' | 'electric' | 'hybrid';

  @ApiProperty({ example: 'mechanic', description: 'Car type' })
  @Column({
    type: DataType.ENUM('mechanic', 'automatic'),
    allowNull: false,
  })
  car_type: 'mechanic' | 'automatic';

  @ApiProperty({
    example: 'A comfortable car for long trips.',
    description: 'Car description',
  })
  @Column({
    type: DataType.STRING,
  })
  description: string;

  @ApiProperty({ example: 1, description: 'Owner ID' })
  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id?: number;
  @BelongsTo(() => User)
  owner: User;

  @HasMany(() => Booking)
  bookings: Booking[];

  @HasMany(() => RentalHistory)
  rental_histories: RentalHistory[];

  @HasMany(() => CarPhoto)
  images: CarPhoto[];

  //   @HasMany(() => Comment)
  //   comments: Comment[];
}
