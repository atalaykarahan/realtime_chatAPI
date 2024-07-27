import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { FriendStatus } from '../../enum';

@Table({ tableName: 'FRIEND' })
@Table({
  paranoid: true,
})
export class Friend extends Model<Friend> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    allowNull: false,
  })
  user_mail: string;

  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    allowNull: false,
  })
  user_mail2: string;

  @Column({
    type: DataType.ENUM,
    values: Object.keys(FriendStatus),
    allowNull: false,
    defaultValue: FriendStatus.friend,
    get() {
      return this.getDataValue('friend_status') as FriendStatus;
    },
    set(value: FriendStatus) {
      this.setDataValue('friend_status', value);
    },
  })
  friend_status: FriendStatus;
}
