import { Module } from '@nestjs/common';
import { messagesProviders } from './messages.providers';
import { MessagesService } from './messages.service';

@Module({
    providers: [MessagesService, ...messagesProviders],
    exports: [MessagesService],
})
export class MessagesModule {}
