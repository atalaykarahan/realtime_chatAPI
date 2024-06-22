import { Logger } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { ChatService } from './chat.service';

@WebSocketGateway({
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayInit {
  private readonly logger = new Logger(ChatGateway.name);
  constructor(private readonly chatService: ChatService) {}

  afterInit(): void {
    this.logger.log('Websocket Gateway initialized.');
  }
}
