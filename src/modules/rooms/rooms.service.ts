import { Inject, Injectable } from '@nestjs/common';
import { ROOM_REPOSITORY, SEQUELIZE } from '../../core/constants';
import { Sequelize } from 'sequelize-typescript';
import { RoomDto } from './dto/room.dto';
import { Room } from './room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: typeof Room,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
  ) {}

  async create(props: RoomDto): Promise<Room> {
    const room = await this.roomRepository.create<Room>(props);
    return room;
  }
}
