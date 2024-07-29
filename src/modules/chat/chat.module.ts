import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from '../messages/messages.module';
import { DatabaseModule } from '../../core/database/database.module';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [MessagesModule, DatabaseModule, RoomsModule],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
