import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Response } from 'express';
import { ValidSession } from '../../core/guards/validSession.guard';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessagesService) {}

  //region api/v1/message/history | post
  @UseGuards(ValidSession)
  @Post('chat/history')
  async getHistoryByRoomId(
    @Body() body: { room_id: string },
    @Res() res: Response,
  ) {
    if (!body.room_id)
      throw new HttpException(
        'Missing parameter (room_id)',
        HttpStatus.BAD_REQUEST,
      );
    //buraya daha sonra kullanici o odada ise gecmis mesajlari gorebilme kontrolu gelmeli!
    const history = await this.messageService.getHistoryByRoomId(body.room_id);
    return res.status(HttpStatus.OK).json(history);
  }

  //endregion

  //region api/v1/message/chat_list/history | get
  @UseGuards(ValidSession)
  @Get('chat_list/history')
  async getChatListHistoryByRoomId(
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    //buraya daha sonra kullanici o odada ise gecmis mesajlari gorebilme kontrolu gelmeli!
    console.log('atalay karahn burası olmalı');
    const chatListHistory = await this.messageService.getChatHistoryByUserId(
      session.user.id,
    );
    console.log('dönen data ise şu olmalı', chatListHistory);
    return res.status(HttpStatus.OK).json(chatListHistory);
  }

  //endregion

  //api/v1/message/conversation
  // @Get('conversation')
  // async Conversation(
  //   @Session() session: Record<string, any>,
  //   @Res() res: Response,
  // ) {
  //   const user_id = session.user.id;
  //   const oldConversations = await this.messageService.getConversation(user_id);
  //   return res.status(HttpStatus.OK).json(oldConversations);
  // }
}
