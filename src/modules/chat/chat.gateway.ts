import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { MessageDto } from '../messages/dto/message.dto';
import { MessagesService } from '../messages/messages.service';

@WebSocketGateway({
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  private userSockets = new Map<string, string>();
  constructor(private readonly messageService: MessagesService) {}

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
  async handleMessage(
    client: any,
    payload: { DestionationUserId: string; message: string },
  ) {
    const { DestionationUserId, message } = payload;
    //socket id user_id ile aynı sey degil
    const destinationSocketId = this.userSockets.get(DestionationUserId);

    if (destinationSocketId) {
      try {
        //insert kodu buraya gelecek
        const messageObj: MessageDto = {
          message_content: message,
          message_sender_id: client.user_id,
          message_receiver_id: DestionationUserId,
          message_read_status: 'unread',
        };

        const createdMessage = this.messageService.create(messageObj);

        if (createdMessage) {
          this.io.to(destinationSocketId).emit('chat', {
            sender_id: client.user_id,
            message: message,
          });

          console.log(
            'Mesaj başarıyla gönderildi ve veritabanına eklendi.',
            createdMessage,
          );
        } else {
          console.error('Mesaj veritabanına eklenemedi.');
        }
      } catch (error) {
        console.error('Mesaj veritabanına eklenirken bir hata oluştu:', error);
      }
    } else {
      this.logger.warn(`User with id: ${DestionationUserId} is not connected.`);
    }
  }
}
