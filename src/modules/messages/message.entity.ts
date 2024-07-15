import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { READ_STATUS, ReadStatus } from 'src/enum';
import { User } from '../users/user.entity';

@Table({ tableName: 'MESSAGE' })
export class Message extends Model<Message> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  message_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message_content: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message_sender_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message_receiver_id: string;

  @Column({
    type: DataType.ENUM(...READ_STATUS),
    allowNull: false,
  })
  message_read_status: ReadStatus;


  @BelongsTo(() => User, 'message_sender_id')
  sender: User;

  @BelongsTo(() => User, 'message_receiver_id')
  receiver: User;


}
