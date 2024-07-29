import { Module } from '@nestjs/common';
import { messagesProviders } from './messages.providers';
import { MessagesService } from './messages.service';
import { MessageController } from './message.controller';

@Module({
  providers: [MessagesService, ...messagesProviders],
  exports: [MessagesService],
  controllers: [MessageController],
})
export class MessagesModule {}
