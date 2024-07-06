import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Namespace, Socket } from 'socket.io';
import { ValidSession } from 'src/core/guards/validSession.guard';


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
    this.io.use
  }

  handleConnection(client: any) {
    const sockets = this.io.sockets;

    this.logger.debug(
        `Socket connected with userID: ${client.user_id}, and name: "${client.name}"`,
      );

    this.logger.log(`WS Client with id: ${client.id} connected!`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    this.io.emit('merhaba', "abuzer ");
  }
  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    // this.logger.debug(
    //   `Total clients connected to room '${roomName}': ${clientCount}`,
    // );
  }
}
