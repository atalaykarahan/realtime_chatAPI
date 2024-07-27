import { Inject, Injectable } from '@nestjs/common';
import { FRIEND_REPOSITORY, SEQUELIZE } from '../../core/constants';
import { Friend } from './friend.entity';
import { FriendDto } from './dto/friend.dto';
import sequelize, { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class FriendsService {
  constructor(
    @Inject(FRIEND_REPOSITORY)
    private readonly friendRepository: typeof Friend,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
  ) {}

  async create(request: FriendDto, transaction: Transaction): Promise<boolean> {
    try {
      await this.friendRepository.create<Friend>(request, { transaction });
      return true;
    } catch (e) {
      console.error('create friend kısmında hata transaction ', e);
    }
  }

  async getFriends(user_mail: string): Promise<any> {
    const friends = await this.sequelize.query(
      `
    SELECT 
         u.user_email as friend_mail, 
         u.user_name, 
         u.user_photo
       FROM 
         "USER" u
       JOIN 
         "FRIEND" f
       ON 
         (u.user_email = CASE 
                  WHEN f.user_mail = :userEmail THEN f.user_mail2
                  WHEN f.user_mail2 = :userEmail THEN f.user_mail
                  ELSE NULL
                END)
       WHERE 
         (f.user_mail = :userEmail OR f.user_mail2 = :userEmail)
         AND u.user_email != :userEmail`,
      {
        replacements: {
          userEmail: user_mail,
        },
        type: sequelize.QueryTypes.SELECT,
      },
    );

    return friends;
  }
}
