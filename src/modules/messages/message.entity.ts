import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { READ_STATUS, ReadStatus } from 'src/enum';

@Table({ tableName: 'MESSAGE' })
export class Message extends Model<Message> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  message_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message_content: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message_sender_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message_receiver_id: string;

  @Column({
    type: DataType.ENUM(...READ_STATUS),
    allowNull: false,
    defaultValue: 'unread',
  })
  message_read_status: ReadStatus;
}
