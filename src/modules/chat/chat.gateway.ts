import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Namespace, Socket, } from 'socket.io';

@WebSocketGateway({
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  constructor(private readonly chatService: ChatService) {}

    @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log('Websocket Gateway initialized.');
  }

  handleConnection(client: Socket) {
    throw new Error('Method not implemented.');
  }
  handleDisconnect(client: Socket) {
    throw new Error('Method not implemented.');
  }
}
