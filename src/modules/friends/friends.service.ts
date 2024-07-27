import { Inject, Injectable } from '@nestjs/common';
import { FRIEND_REPOSITORY, SEQUELIZE } from '../../core/constants';
import { Friend } from './friend.entity';
import { FriendDto } from './dto/friend.dto';
import sequelize, { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { FriendStatus } from '../../enum';

@Injectable()
export class FriendsService {
  constructor(
    @Inject(FRIEND_REPOSITORY)
    private readonly friendRepository: typeof Friend,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
  ) {}

  //#region CREATE FRIENDSHIP
  async create(request: FriendDto, transaction: Transaction): Promise<boolean> {
    try {
      await this.friendRepository.create<Friend>(request, { transaction });
      return true;
    } catch (e) {
      console.error('create friend kısmında hata transaction ', e);
      return false;
    }
  }

  //#endregion

  //#region GET ALL FRIENDS BY USER EMAIL
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
         AND u.user_email != :userEmail
         AND f.friend_status = :friendStatus
         AND f."deletedAt" IS NULL`,
      {
        replacements: {
          userEmail: user_mail,
          friendStatus: FriendStatus.friend,
        },
        type: sequelize.QueryTypes.SELECT,
      },
    );

    return friends;
  }

  //#endregion

  //#region BLOCK FRIEND BY EMAIL
  async blockFriend(user_mail: string, friend_mail: string): Promise<boolean> {
    const friendRow = await this.getFriendByMail({
      user_mail: user_mail,
      user_mail2: friend_mail,
    });

    if (!friendRow) {
      return false;
    }

    const isUser1 = friendRow.user_mail === user_mail;
    switch (friendRow.friend_status) {
      case FriendStatus.friend:
        friendRow.friend_status = isUser1
          ? FriendStatus.block_first_second
          : FriendStatus.block_second_first;
        break;
      case FriendStatus.block_first_second:
        if (!isUser1) {
          friendRow.friend_status = FriendStatus.block_both;
        }
        break;
      case FriendStatus.block_second_first:
        if (isUser1) {
          friendRow.friend_status = FriendStatus.block_both;
        }
        break;
      // Eğer ikisi de birbirini blokladıysa, friend_status değişmeyecek.
    }
    await friendRow.save();
    return true;
  }

  //#endregion

  //region GET FRIEND BY MAIL
  async getFriendByMail(props: FriendDto): Promise<Friend> {
    const friendRow = await this.friendRepository.findOne({
      where: {
        [Op.or]: [
          { user_mail: props.user_mail, user_mail2: props.user_mail2 },
          { user_mail: props.user_mail2, user_mail2: props.user_mail },
        ],
      },
    });

    return friendRow;
  }

  //endregion

  //#region DELETE FRIENDSHIP
  async delete(props: FriendDto): Promise<boolean> {
    const friendRow = await this.getFriendByMail(props);

    if (!friendRow) {
      return false;
    }

    await friendRow.destroy();
    return true;
  }

  //#endregion
}
