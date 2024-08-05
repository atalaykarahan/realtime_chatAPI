import { FILE_REPOSITORY } from 'src/core/constants';
import { File } from './file.entity';

export const filesProviders = [
  {
    provide: FILE_REPOSITORY,
    useValue: File,
  },
];
