import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { FriendStatus } from '../../enum';
import { User } from '../users/user.entity';

@Table({ tableName: 'FRIEND' })
@Table({
  paranoid: true,
})
export class Friend extends Model<Friend> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  user_mail: string;

  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  user_mail2: string;

  @Column({
    type: DataType.STRING,
    values: Object.keys(FriendStatus),
    allowNull: false,
    defaultValue: FriendStatus.friend,
    field: 'friend_status',
  })
  friend_status: FriendStatus;

  // @BelongsTo(() => User, 'user_mail')
  // user1: User;
  //
  // @BelongsTo(() => User, 'user_mail2')
  // user2: User;

  @BelongsTo(() => User, {
    foreignKey: 'user_mail',
    targetKey: 'user_email',
    as: 'user1',
  })
  user1: User;

  @BelongsTo(() => User, {
    foreignKey: 'user_mail2',
    targetKey: 'user_email',
    as: 'user2',
  })
  user2: User;
}
