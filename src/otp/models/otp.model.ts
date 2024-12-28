import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
  HasMany,
} from "sequelize-typescript";

interface IOtpCreationAttr{
    id:string;
    otp:string;
    expiration_time: Date;
    verified:boolean;
    email:string;
}

@Table({tableName:"otp"})
export class Otp extends Model<Otp, IOtpCreationAttr>{
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    id: string;

    @Column({
        type: DataType.STRING,
    })
    otp: string;

    @Column({
        type: DataType.DATE,
    })
    expiration_time: Date;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    verified: boolean;

    @Column({
        type: DataType.STRING,
    })
    email: string;
}