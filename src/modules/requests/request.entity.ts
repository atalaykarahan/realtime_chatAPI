import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { RequestStatus } from '../../enum';
import { User } from '../users/user.entity';

@Table({ tableName: 'REQUEST' })
@Table({
  updatedAt: false,
  paranoid: true,
})
export class Request extends Model<Request> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    allowNull: true,
    autoIncrement: true,
  })
  request_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sender_mail: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  receiver_mail: string;

  @Column({
    type: DataType.ENUM,
    values: Object.keys(RequestStatus),
    allowNull: false,
    defaultValue: RequestStatus.pending,
    get() {
      return this.getDataValue('request_status') as RequestStatus;
    },
    set(value: RequestStatus) {
      this.setDataValue('request_status', value);
    },
  })
  request_status: RequestStatus;

  @BelongsTo(() => User, { foreignKey: 'sender_mail', targetKey: 'user_email' })
  sender: User;
}
