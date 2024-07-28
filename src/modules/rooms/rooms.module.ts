import { RoomsService } from './rooms.service';
import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { roomsProviders } from './rooms.providers';

@Module({
  providers: [RoomsService, ...roomsProviders],
  exports: [RoomsService],
  controllers: [RoomController],
})
export class RoomsModule {}
