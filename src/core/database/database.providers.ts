import { Sequelize } from 'sequelize-typescript';
import { Message } from '../../modules/messages/message.entity';
import { User } from '../../modules/users/user.entity';
import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from '../constants';
import { databaseConfig } from './database.config';
import { Request } from '../../modules/requests/request.entity';
import { Friend } from '../../modules/friends/friend.entity';
import { Room } from '../../modules/rooms/room.entity';
import { UserRoom } from '../../modules/user-rooms/user-room.entity';
import { File } from '../../modules/files/file.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([
        User,
        Message,
        Request,
        Friend,
        Room,
        UserRoom,
        File,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
