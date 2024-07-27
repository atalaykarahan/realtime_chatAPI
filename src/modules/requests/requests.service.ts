import { Inject, Injectable } from '@nestjs/common';
import { REQUEST_REPOSITORY, SEQUELIZE } from '../../core/constants';
import { Request } from './request.entity';
import { RequestDto } from './dto/request.dto';
import { User } from '../users/user.entity';
import { RequestStatus } from '../../enum';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { FriendsService } from '../friends/friends.service';

@Injectable()
export class RequestsService {
  constructor(
    @Inject(REQUEST_REPOSITORY)
    private readonly requestRepository: typeof Request,
    private readonly friendService: FriendsService,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
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

  async updateStatusAndDelete(
    status: RequestStatus,
    sender_mail: string,
    receiver_mail: string,
    transaction: Transaction,
  ): Promise<boolean> {
    const request = await this.requestRepository.findOne({
      where: { sender_mail: sender_mail, receiver_mail: receiver_mail },
      transaction,
    });
    request.request_status = status;
    await request.save({ transaction });
    await request.destroy({ transaction });
    return true;
  }

  async acceptFriendship(
    sender_mail: string,
    receiver_mail: string,
  ): Promise<boolean> {
    const transaction = await this.sequelize.transaction();

    try {
      await this.updateStatusAndDelete(
        RequestStatus.accepted,
        sender_mail,
        receiver_mail,
        transaction,
      );

      await this.friendService.create(
        {
          user_mail: sender_mail,
          user_mail2: receiver_mail,
        },
        transaction,
      );

      await transaction.commit();
      return true;
    } catch (e) {
      await transaction.rollback();
      console.error('accept friendship kısmında hata!! ', e);
      return false;
    }
  }
}
