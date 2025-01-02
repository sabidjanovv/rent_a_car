import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface IOwnerAttr {
  full_name: string;
  login: string;
  email: string;
  phone_number: string;
}

@Table({ tableName: 'owners' })
export class Owner extends Model<Owner, IOwnerAttr> {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Sardor Sobidjonov',
    description: "Owner's full name",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @ApiProperty({
    example: 'Owner1234',
    description: 'Unique login for the Owner',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  login: string;

  @ApiProperty({
    example: 'Owner@gmail.com',
    description: "Owner's email address",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: '+998901234567',
    description: "Owner's phone number",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone_number: string;
}