import { USER_ROOM_REPOSITORY } from '../../core/constants';
import { UserRoom } from './user-room.entity';

export const userRoomsProviders = [
  {
    provide: USER_ROOM_REPOSITORY,
    useValue: UserRoom,
  },
];
