import { RoomsService } from './rooms.service';
import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { roomsProviders } from './rooms.providers';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../../core/database/database.module';
import { UserRoomsModule } from '../user-rooms/user-rooms.module';

@Module({
  imports: [UsersModule, DatabaseModule, UserRoomsModule],
  providers: [RoomsService, ...roomsProviders],
  exports: [RoomsService],
  controllers: [RoomController],
})
export class RoomsModule {}
