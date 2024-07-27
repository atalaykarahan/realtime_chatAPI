import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { FriendStatus } from '../../enum';

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
}
