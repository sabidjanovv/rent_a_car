import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Booking } from '../../booking/models/booking.model';
// import { Contract } from '../../contract/models/contract.model';

@Table({ tableName: 'payments' })
export class Payment extends Model<Payment> {
  @ApiProperty({ example: 1, description: 'Unique Payment ID' })
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'Booking ID associated with this payment',
  })
  @ForeignKey(() => Booking)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  booking_id: number;
  @BelongsTo(() => Booking)
  booking: Booking;

  @ApiProperty({
    example: 200.5,
    description: 'Payment amount in currency units',
  })
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0,
    },
  })
  amount: number;

  @ApiProperty({ example: '1000 USD', description: 'Garov summasi' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  pledge: string;

  @ApiProperty({
    example: '2024-11-01',
    description: 'Date when the payment was made',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  payment_date: string;

  @ApiProperty({
    example: 'credit_card',
    description: 'Type of payment method',
    enum: ['credit_card', 'cash'],
  })
  @Column({
    type: DataType.ENUM('credit_card', 'cash'),
    allowNull: false,
  })
  payment_type: 'credit_card' | 'cash';

  @ApiProperty({
    example: 'completed',
    description: 'Status of the payment',
    enum: ['pending', 'completed', 'failed'],
  })
  @Column({
    type: DataType.ENUM('pending', 'completed', 'failed'),
    allowNull: false,
  })
  payment_status: 'pending' | 'completed' | 'failed';
}
