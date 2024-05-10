import { Table, Column, Model, DataType } from 'sequelize-typescript';

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

  // @Column({
  //   type: DataType.DATE,
  //   allowNull: false,
  // })
  // createdAt: Date;

  // @Column({
  //   type: DataType.DATE,
  //   allowNull: false,
  // })
  // updatedAt: Date;

  // @Column({
  //   type: DataType.DATE,
  //   allowNull: true,
  // })
  // deletedAt: Date;
}
