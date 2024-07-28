import { Controller } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomsService) {}
}
