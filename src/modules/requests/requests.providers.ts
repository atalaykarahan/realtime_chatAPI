import { REQUEST_REPOSITORY } from '../../core/constants';
import { Request } from './request.entity';

export const requestsProviders = [
  {
    provide: REQUEST_REPOSITORY,
    useValue: Request,
  },
];
