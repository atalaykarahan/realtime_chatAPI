import { Inject, Logger } from '@nestjs/common';
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
import { RoomsService } from '../rooms/rooms.service';
import { SEQUELIZE } from '../../core/constants';
import { Sequelize } from 'sequelize-typescript';
import { from } from 'rxjs';

@WebSocketGateway({
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  private userSockets = new Map<string, string>();

  constructor(
    private readonly messageService: MessagesService,
    private readonly roomService: RoomsService,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
  ) {}

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

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: any, roomId: string) {
    client.join(roomId);
    this.logger.debug(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: any,
    payload: { room_id: string; message: string },
  ) {
    const { room_id, message } = payload;
    if (room_id && message) {
      const transaction = await this.sequelize.transaction();
      try {
        const messageObj: MessageDto = {
          room_id: room_id,
          message: message,
          sender_id: client.user_id,
        };
        const createdMessage = await this.messageService.create(
          messageObj,
          transaction,
        );
        const destinationRoom = await this.roomService.getByPk(room_id);
        destinationRoom.last_message = message;
        await destinationRoom.save({ transaction });
        await transaction.commit();

        if (createdMessage) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { room_id, deletedAt, ...result } =
            createdMessage['dataValues'];
          // this.io.to(chat_list).emit('alper_id', result);
          this.io.emit(room_id, result);
          // this.io.emit(genel_id, 'herekese merhaba');

          //chat list için
          //this.io.emit(chat_list, alperin, {şunadn bundan son mesaj bu bu geldi});
          //this.io.to('friend_notification').emit('alper_id', {kimden falan filan})
        }
      } catch (e) {
        await transaction.rollback();
        console.error('Mesaj veritabanına eklenirken bir hata oluştu  ', e);
      }
    }
  }
}
