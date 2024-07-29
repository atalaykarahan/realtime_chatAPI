import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { RoomType } from '../../enum';
import { UserRoom } from '../user-rooms/user-room.entity';

@Table({ tableName: 'ROOM' })
export class Room extends Model<Room> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: true,
    autoIncrement: true,
  })
  room_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  created_user_id: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  message_count: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  last_message: string;

  @Column({
    type: DataType.STRING,
    values: Object.keys(RoomType),
    allowNull: false,
    defaultValue: RoomType.private,
    field: 'room_type',
  })
  room_type: RoomType;

  @HasMany(() => UserRoom)
  userRooms: UserRoom[];
}
