import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Room } from '../rooms/room.entity';

@Table({ tableName: 'USER_ROOM' })
export class UserRoom extends Model<UserRoom> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  user_id: string;

  @ForeignKey(() => Room)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: true,
  })
  room_id: string;

  @BelongsTo(() => Room)
  room: Room;
}
