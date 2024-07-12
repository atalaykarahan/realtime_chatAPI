import { Inject, Injectable } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from 'src/core/constants';
import { Message } from './message.entity';
import { MessageDto } from './dto/message.dto';
import { Op } from 'sequelize';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: typeof Message,
  ) {}

  async create(message: MessageDto): Promise<Message> {
    return await this.messageRepository.create<Message>(message);
  }

  async getPrivateConversation(
    sender_id: string,
    receiver_id: string,
  ): Promise<Message[]> {
    try {
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { message_sender_id: sender_id, message_receiver_id: receiver_id },
            { message_sender_id: receiver_id, message_receiver_id: sender_id },
          ],
        },
        order: [['createdAt', 'ASC']], // createdAt alanına göre artan sıralama
      });
      return messages;
    } catch (error) {
      // Hata işleme
      throw new Error('Private conversation retrieval failed');
    }
  }
}
