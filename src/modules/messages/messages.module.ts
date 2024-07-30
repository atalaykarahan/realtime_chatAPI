import { Module } from '@nestjs/common';
import { messagesProviders } from './messages.providers';
import { MessagesService } from './messages.service';
import { MessageController } from './message.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [MessagesService, ...messagesProviders],
  exports: [MessagesService],
  controllers: [MessageController],
})
export class MessagesModule {}
