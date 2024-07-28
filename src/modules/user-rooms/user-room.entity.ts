import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'USER_ROOM' })
export class UserRoom extends Model<UserRoom> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  user_id: string;

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: true,
  })
  room_id: string;
}
