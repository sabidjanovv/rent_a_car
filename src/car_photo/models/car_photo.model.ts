import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Car } from '../../cars/models/car.model';
// import { Venue } from '../../venue/models/venue.model';

interface CarPhotoCreationAttr {
  car_id: number;
  url: string;
}

@Table({ tableName: 'car_photo', timestamps: false })
export class CarPhoto extends Model<CarPhoto, CarPhotoCreationAttr> {
  @ApiProperty({
    example: 1,
    description: 'Rasmlarning unical ID raqami (autoIncrement)',
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: "Rasm tegishli bo'lgan CarId",
  })
  @ForeignKey(() => Car)
  @Column({
    type: DataType.INTEGER,
  })
  car_id: number;

  @ApiProperty({
    example: 'image1.jpg',
    description: 'Rasmning URL',
  })
  @Column({
    type: DataType.STRING(),
  })
  url: string;

  @BelongsTo(() => Car)
  car: Car;
}
