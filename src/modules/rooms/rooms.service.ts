import { Inject, Injectable } from '@nestjs/common';
import { ROOM_REPOSITORY, SEQUELIZE } from '../../core/constants';
import { Sequelize } from 'sequelize-typescript';
import { RoomDto } from './dto/room.dto';
import { Room } from './room.entity';
import { Transaction } from 'sequelize';
import { UsersService } from '../users/users.service';
import { UserRoomsService } from '../user-rooms/user-rooms.service';

@Injectable()
export class RoomsService {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: typeof Room,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
    private readonly userService: UsersService,
    private readonly userRoomsService: UserRoomsService,
  ) {}

  async create(props: RoomDto, transaction: Transaction): Promise<any> {
    try {
      const room = await this.roomRepository.create<Room>(props, {
        transaction,
      });
      return { room_id: room.room_id };
    } catch (e) {
      console.error('create room kısmında hata!! ', e);
    }
  }

  async createAndAddUsers(
    createdUserId: string,
    user_id2: string,
  ): Promise<string> {
    const transaction = await this.sequelize.transaction();

    try {
      const newRoom = await this.create(
        { created_user_id: createdUserId },
        transaction,
      );

      for (let i = 0; i <= 1; i++) {
        const userId = i === 0 ? createdUserId : user_id2;
        await this.userRoomsService.create(
          { user_id: userId, room_id: newRoom.room_id },
          transaction,
        );
      }

      await transaction.commit();
      return newRoom;
    } catch (e) {
      await transaction.rollback();
      console.error('create and add users kısmında hata!! ', e);
    }
  }

  async getOrCreatePrivateRoom(
    user_id1: string,
    friend_email: string,
  ): Promise<any> {
    const user2 = await this.userService.findOneByEmail(friend_email);
    let newRoom: string;
    newRoom = await this.userRoomsService.checkAndGetPrivateRoom(
      user_id1,
      user2.user_id,
    );
    // if roomId exists then create one
    if (!newRoom) {
      newRoom = await this.createAndAddUsers(user_id1, user2.user_id);
    }
    return newRoom;
  }
}
