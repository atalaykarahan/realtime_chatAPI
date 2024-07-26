import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ReqeustStatus } from '../../enum';

@Table({ tableName: 'REQUEST' })
@Table({
  updatedAt: false,
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
    values: Object.keys(ReqeustStatus),
    allowNull: false,
    defaultValue: ReqeustStatus.pending,
    get() {
      return this.getDataValue('requst_status') as ReqeustStatus;
    },
    set(value: ReqeustStatus) {
      this.setDataValue('requst_status', value);
    },
  })
  request_status: ReqeustStatus;
}
