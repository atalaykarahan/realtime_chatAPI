import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Message } from '../messages/message.entity';

@Table({ tableName: 'USER' })
export class User extends Model<User> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  user_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  user_email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  user_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false,
  })
  user_photo: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false,
    defaultValue: 'standard',
  })
  user_role: string;

  @HasMany(() => Message, 'message_sender_id')
  sentMessages: Message[];

  @HasMany(() => Message, 'message_receiver_id')
  receivedMessages: Message[];
}
