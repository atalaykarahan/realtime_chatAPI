import { Inject, Injectable } from '@nestjs/common';
import { USER_ROOM_REPOSITORY } from '../../core/constants';
import { UserRoomDto } from './dto/user-room.dto';
import { UserRoom } from './user-room.entity';
import { Op, Transaction } from 'sequelize';
import { RoomType } from '../../enum';
import { Sequelize } from 'sequelize-typescript';
import { Room } from '../rooms/room.entity';

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

  async checkAndGetPrivateRoom(
    user_id1: string,
    user_id2: string,
  ): Promise<any> {
    // const privateRoom = await this.userRoomRepository.findAll();
    const roomId = await this.userRoomRepository.findOne({
      include: [
        {
          model: Room,
          attributes: ['room_id'],
          where: {
            room_type: RoomType.private,
          },
        },
      ],
      where: {
        user_id: {
          [Op.in]: [user_id1, user_id2],
        },
      },
      attributes: ['UserRoom.room_id'],
      group: ['UserRoom.room_id', 'room.room_id'],
      having: Sequelize.literal('COUNT(DISTINCT "UserRoom"."user_id") = 2'),
    });
    console.log('burayı takip et', roomId);
    if (!roomId) return false;
    return roomId.room;
  }
}
