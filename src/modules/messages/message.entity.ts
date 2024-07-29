import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ReadStatus } from 'src/enum';

@Table({ tableName: 'MESSAGE' })
export class Message extends Model<Message> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: true,
    autoIncrement: true,
  })
  message_id: string;

  @Column({
    type: DataType.UUID,
  })
  room_id: string;

  @Column({
    type: DataType.STRING,
    values: Object.keys(ReadStatus),
    allowNull: false,
    defaultValue: ReadStatus.unread,
    field: 'message_status',
  })
  message_status: ReadStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sender_id: string;
}
