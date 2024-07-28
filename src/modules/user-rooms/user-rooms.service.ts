import { Inject, Injectable } from '@nestjs/common';
import { ROOM_REPOSITORY, SEQUELIZE } from '../../core/constants';
import { Sequelize } from 'sequelize-typescript';
import { UserRoomDto } from './dto/user-room.dto';
import { UserRoom } from './user-room.entity';

@Injectable()
export class UserRoomsService {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly userRoomRepository: typeof UserRoom,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
  ) {}

  async create(props: UserRoomDto): Promise<UserRoom> {
    const userRoom = await this.userRoomRepository.create<UserRoom>(props);
    return userRoom;
  }
}
