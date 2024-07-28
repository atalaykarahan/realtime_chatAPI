import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
}
