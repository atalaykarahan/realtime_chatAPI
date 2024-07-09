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
  private userSockets = new Map<string, string>();
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log('Websocket Gateway initialized.');
    this.io.use;
  }

  handleConnection(client: any) {
    const sockets = this.io.sockets;

    const userId = client.user_id;
    const userName = client.user_name;

    this.logger.debug(
      `Socket connected with userID: ${userId}, and name: "${userName}"`,
    );

    this.logger.log(`WS Client with id: ${client.id} connected!`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

   

    this.userSockets.set(userId, client.id); 

    //bu kod mesajı gönderiyor
    // this.io.emit(
    //   '114950733215735919150',
    //   'merhaba atalay bu mesaj back-end tarafından sana gelmekte',
    // );
  }

  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;
    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    //bu alttaki kısma sonradan bak
    // this.logger.debug(
    //   `Total clients connected to room '${roomName}': ${clientCount}`,
    // );
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: any, payload: { DestionationUserId: string; message: string }) {
    const { DestionationUserId, message } = payload;
    //socket id user_id ile aynı sey degil
    const destinationSocketId = this.userSockets.get(DestionationUserId);

    console.log("tetiklendi mesaj bir şekilde gönderilmiş olmalı--------------", payload)

    if (destinationSocketId) {

     //insert kodu buraya gelecek

      this.io.to(destinationSocketId).emit("chat", {
        sender_id: client.user_id,
        message: message,
      });
    } else {
      this.logger.warn(`User with id: ${DestionationUserId} is not connected.`);


    }
  }
}
