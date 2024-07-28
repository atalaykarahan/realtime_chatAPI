import { Inject, Injectable } from '@nestjs/common';
import { USER_ROOM_REPOSITORY } from '../../core/constants';
import { UserRoomDto } from './dto/user-room.dto';
import { UserRoom } from './user-room.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class UserRoomsService {
  constructor(
    @Inject(USER_ROOM_REPOSITORY)
    private readonly userRoomRepository: typeof UserRoom,
  ) {}

  async create(
    props: UserRoomDto,
    transaction: Transaction,
  ): Promise<UserRoom> {
    try {
      const userRoom = await this.userRoomRepository.create<UserRoom>(props, {
        transaction,
      });
      return userRoom;
    } catch (e) {
      console.error('create user_room kısmında hata oluştu', e);
    }
  }
}
