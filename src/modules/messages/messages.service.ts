import { Inject, Injectable } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from 'src/core/constants';
import { Message } from './message.entity';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: typeof Message,
  ) {}

  async create(message: MessageDto): Promise<Message> {
    return await this.messageRepository.create<Message>(message);
  }
}
