import { ROOM_REPOSITORY } from '../../core/constants';
import { Room } from './room.entity';

export const roomsProviders = [
  {
    provide: ROOM_REPOSITORY,
    useValue: Room,
  },
];
