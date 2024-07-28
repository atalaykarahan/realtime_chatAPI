import { UserRoomsService } from './user-rooms.service';
import { Module } from '@nestjs/common';
import { UserRoomController } from './user-room.controller';
import { userRoomsProviders } from './user-rooms.providers';

@Module({
  providers: [UserRoomsService, ...userRoomsProviders],
  exports: [UserRoomsService],
  controllers: [UserRoomController],
})
export class UserRoomsModule {}
