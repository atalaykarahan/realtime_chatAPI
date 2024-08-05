import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'FILE' })
@Table({
  updatedAt: false,
  paranoid: true,
})
export class File extends Model<File> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: true,
    autoIncrement: true,
  })
  file_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  room_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sender_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  file_name: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  file_byte: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  message_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  file_type: string;
}
