import { Inject, Injectable } from '@nestjs/common';
import { REQUEST_REPOSITORY } from '../../core/constants';
import { Request } from './request.entity';
import { RequestDto } from './dto/request.dto';
import { User } from '../users/user.entity';
import { RequestStatus } from '../../enum';

@Injectable()
export class RequestsService {
  constructor(
    @Inject(REQUEST_REPOSITORY)
    private readonly requestRepository: typeof Request,
  ) {}

  async create(request: RequestDto): Promise<boolean> {
    await this.requestRepository.create<Request>(request);
    return true;
  }

  async getComingByEmail(user_email: string): Promise<any> {
    const requests = await this.requestRepository.findAll({
      where: { receiver_mail: user_email },
      include: [
        {
          model: User,
          as: 'sender', // İlişki adı, Modelde tanımladığınız 'as' ile aynı olmalı
          attributes: ['user_name', 'user_photo', 'user_email'],
        },
      ],
      attributes: ['sender_mail'], // 'REQUEST' tablosundan dönecek alanlar
    });
    return requests.map((request) => ({
      sender_mail: request.sender_mail,
      user_name: request.sender?.user_name,
      user_photo: request.sender?.user_photo,
    }));
  }

  async acceptAndDelete(
    sender_mail: string,
    receiver_mail: string,
  ): Promise<boolean> {
    const request = await this.requestRepository.findOne({
      where: { sender_mail: sender_mail, receiver_mail: receiver_mail },
    });
    request.request_status = RequestStatus.accepted;
    await request.save();
    await request.destroy();
    return true;
  }
}
