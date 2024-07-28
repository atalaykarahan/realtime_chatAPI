import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { ValidSession } from '../../core/guards/validSession.guard';
import { Response } from 'express';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomsService) {}

  // api/v1/room | post
  @UseGuards(ValidSession)
  @Post('check')
  async checkPrivateRoom(
    @Body() body: { friendMail: string },
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    if (!body.friendMail)
      throw new HttpException('friendMail is missing', HttpStatus.BAD_REQUEST);
    const roomId = await this.roomService.getOrCreatePrivateRoom(
      session.user.id,
      body.friendMail,
    );

    return res.status(HttpStatus.OK).send(roomId);
  }
}
