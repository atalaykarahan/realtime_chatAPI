import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { ValidSession } from '../../core/guards/validSession.guard';
import { Response } from 'express';

@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendsService) {}

  // api/v1/friend | get
  //#region GET FRIENDS
  @UseGuards(ValidSession)
  @Get()
  async getFriends(
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const friends = await this.friendService.getFriends(session.user.mail);

    if (!friends)
      throw new HttpException('Friends is exists', HttpStatus.NO_CONTENT);

    return res.status(HttpStatus.OK).json(friends);
  }
  //#endregion
}
