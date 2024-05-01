import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'USER' })
export class User extends Model<User> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  user_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  user_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  user_password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  user_email: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  user_authority_id: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  user_email_verified: boolean;

  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
  })
  user_google_id: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  user_visibility: boolean;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  user_library_visibility: boolean;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  updatedAt: Date;
}
