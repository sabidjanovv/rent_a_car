import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/models/user.model';
import { Car } from '../../cars/models/car.model';

@Table({ tableName: 'likes' })
export class Like extends Model<Like> {
  @ApiProperty({ example: 1, description: 'Unique Like ID' })
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: 1, description: 'User ID who liked the car post' })
  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id: number;
  @BelongsTo(() => User)
  user: User;

  @ApiProperty({ example: 1, description: 'Car ID liked by the user' })
  @ForeignKey(() => Car)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  car_id: number;
  @BelongsTo(() => Car)
  car: Car;
}
