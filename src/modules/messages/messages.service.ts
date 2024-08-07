import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MESSAGE_REPOSITORY, SEQUELIZE } from 'src/core/constants';
import { Message } from './message.entity';
import { MessageDto } from './dto/message.dto';
import sequelize, { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: typeof Message,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
  ) {}

  //region CREATE MESSAGE
  async create(
    message: MessageDto,
    transaction?: Transaction,
  ): Promise<Message> {
    try {
      let newMessage;
      if (transaction) {
        newMessage = await this.messageRepository.create<Message>(message, {
          transaction,
        });
      } else {
        newMessage = await this.messageRepository.create<Message>(message);
      }

      return newMessage;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  //endregion

  //region GET MESSAGE HISTORY BY ROOM ID
  async getHistoryByRoomId(room_id: string): Promise<Message[]> {
    const messages = await Message.findAll({
      where: { room_id },
      order: [['createdAt', 'ASC']],
    });

    return messages;
  }

  //endregion

  async getChatHistoryByUserId(user_id: string): Promise<any> {
    const chatList = await this.sequelize.query(
      `SELECT r.room_id, r.last_message, r."updatedAt", u.user_name, u.user_email, u.user_photo FROM "USER_ROOM" ur
    INNER JOIN "ROOM" r ON r.room_id = ur.room_id
    LEFT JOIN "USER_ROOM" ur2 ON ur2.room_id = r.room_id
    LEFT JOIN "USER" u ON u.user_id = ur2.user_id
    WHERE ur.user_id = :userId
    AND ur2.user_id != :userId
    AND r."deletedAt" IS NULL
    ORDER BY r."updatedAt" desc`,
      { replacements: { userId: user_id }, type: sequelize.QueryTypes.SELECT },
    );

    return chatList;
  }

  //
  // async getPrivateConversation(
  //   sender_id: string,
  //   receiver_id: string,
  // ): Promise<Message[]> {
  //   const messages = await Message.findAll({
  //     where: {
  //       [Op.or]: [
  //         { message_sender_id: sender_id, message_receiver_id: receiver_id },
  //         { message_sender_id: receiver_id, message_receiver_id: sender_id },
  //       ],
  //     },
  //     order: [['createdAt', 'ASC']], // createdAt alanına göre artan sıralama
  //   });
  //   return messages;
  // }
  //
  // async getConversation(user_id: string): Promise<any> {
  //   const oneMonthAgo = new Date();
  //   oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // 1 ay önce
  //
  //   const messages = await Message.findAll({
  //     where: {
  //       [Op.and]: [
  //         {
  //           [Op.or]: [
  //             { message_sender_id: user_id },
  //             { message_receiver_id: user_id },
  //           ],
  //         },
  //         {
  //           createdAt: {
  //             [Op.gt]: oneMonthAgo,
  //           },
  //         },
  //       ],
  //     },
  //     order: [['createdAt', 'ASC']],
  //     include: [
  //       {
  //         model: User,
  //         as: 'sender',
  //         attributes: ['user_email', 'user_name', 'user_photo'],
  //         where: {
  //           user_id: {
  //             [Op.not]: user_id,
  //           },
  //         },
  //         required: false,
  //       },
  //       {
  //         model: User,
  //         as: 'receiver',
  //         attributes: ['user_email', 'user_name', 'user_photo'],
  //         where: {
  //           user_id: {
  //             [Op.not]: user_id,
  //           },
  //         },
  //         required: false,
  //       },
  //     ],
  //   });
  //
  //   const conversationMap = new Map();
  //
  //   messages.forEach((msg) => {
  //     const otherUser = msg.sender == null ? msg.receiver : msg.sender;
  //     if (otherUser) {
  //       if (!conversationMap.has(otherUser.user_email)) {
  //         conversationMap.set(otherUser.user_email, {
  //           other_user_email: otherUser.user_email,
  //           other_user_name: otherUser.user_name,
  //           other_user_photo: otherUser.user_photo,
  //           messages: [],
  //         });
  //       }
  //
  //       const conversation = conversationMap.get(otherUser.user_email);
  //       conversation.messages.push({
  //         message_id: msg.message_id,
  //         message_content: msg.message_content,
  //         message_sender_id: msg.message_sender_id,
  //         message_receiver_id: msg.message_receiver_id,
  //         message_read_status: msg.message_read_status,
  //         createdAt: msg.createdAt,
  //         updatedAt: msg.updatedAt,
  //       });
  //     }
  //   });
  //
  //   let sortBy = 'asc';
  //   // Mesajları message_id'ye göre sırala
  //   conversationMap.forEach((conversation) => {
  //     conversation.messages.sort((a, b) => {
  //       if (sortBy === 'asc') {
  //         return a.message_id - b.message_id;
  //       } else {
  //         return b.message_id - a.message_id;
  //       }
  //     });
  //   });
  //
  //   const result = Array.from(conversationMap.values());
  //   return result;
  // }
}
