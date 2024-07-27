import { FRIEND_REPOSITORY } from '../../core/constants';

import { Friend } from './friend.entity';

export const friendsProviders = [
  {
    provide: FRIEND_REPOSITORY,
    useValue: Friend,
  },
];
