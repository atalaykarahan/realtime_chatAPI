import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Message } from '../messages/message.entity';
import { Friend } from '../friends/friend.entity';

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
  // @HasMany(() => Friend, 'user_mail')
  // friends1: Friend[];
  //
  // @HasMany(() => Friend, 'user_mail2')
  // friends2: Friend[];

  @HasMany(() => Friend, { foreignKey: 'user_mail', as: 'friendsAsUser1' })
  friendsAsUser1: Friend[];

  @HasMany(() => Friend, { foreignKey: 'user_mail2', as: 'friendsAsUser2' })
  friendsAsUser2: Friend[];
}
