import { Module } from '@nestjs/common';
import { messagesProviders } from './messages.providers';
import { MessagesService } from './messages.service';
import { MessageController } from './message.controller';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../../core/database/database.module';

@Module({
  imports: [UsersModule, DatabaseModule],
  providers: [MessagesService, ...messagesProviders],
  exports: [MessagesService],
  controllers: [MessageController],
})
export class MessagesModule {}
