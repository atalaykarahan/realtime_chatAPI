import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
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

  // api/v1/friend/block | patch
  //#region BLOCK FRIEND
  @UseGuards(ValidSession)
  @Patch('block')
  async blockFriend(
    @Res() res: Response,
    @Session() session: Record<string, any>,
    @Body() body: { friend_mail: string },
  ) {
    if (!body.friend_mail)
      throw new HttpException('Friend mail is missing', HttpStatus.BAD_REQUEST);
    const blockFriendRequest = await this.friendService.blockFriend(
      session.user.mail,
      body.friend_mail,
    );

    if (!blockFriendRequest)
      throw new HttpException(
        'Something went wrong, Friendship does not exists',
        HttpStatus.NO_CONTENT,
      );

    return res.sendStatus(HttpStatus.OK);
  }

  //#endregion
}
