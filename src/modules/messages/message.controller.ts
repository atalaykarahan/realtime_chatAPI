import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  Session,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Response } from 'express';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessagesService) {}

  //bu endpoint henüz korunmuyor daha sonra koru bunu
  //api/v1/message/conversation_private
  @Post('conversation_private')
  async privateConversation(
    @Body() body: { sender_id: string; receiver_id: string },
    @Res() res: Response,
  ) {
    const oldConversations = await this.messageService.getPrivateConversation(
      body.sender_id,
      body.receiver_id,
    );
    return res.status(HttpStatus.OK).json(oldConversations);
  }

  //api/v1/message/conversation
  @Get('conversation')
  async Conversation(
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const user_id = session.user.id;
    const oldConversations = await this.messageService.getConversation(user_id);
    return res.status(HttpStatus.OK).json(oldConversations);
  }
}
