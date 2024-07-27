import { Controller } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendsService) {}
}
