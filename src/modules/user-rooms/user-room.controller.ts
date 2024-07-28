import { Controller } from '@nestjs/common';
import { UserRoomsService } from './user-rooms.service';

@Controller('user_room')
export class UserRoomController {
  constructor(private userRoomService: UserRoomsService) {}
}
