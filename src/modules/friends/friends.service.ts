import { Inject, Injectable } from '@nestjs/common';
import { FRIEND_REPOSITORY } from '../../core/constants';
import { Friend } from './friend.entity';
import { FriendDto } from './dto/friend.dto';
import { Transaction } from 'sequelize';

@Injectable()
export class FriendsService {
  constructor(
    @Inject(FRIEND_REPOSITORY)
    private readonly friendRepository: typeof Friend,
  ) {}

  async create(request: FriendDto, transaction: Transaction): Promise<boolean> {
    try {
      await this.friendRepository.create<Friend>(request, { transaction });
      return true;
    } catch (e) {
      console.error('create friend kısmında hata transaction ', e);
    }
  }
}
