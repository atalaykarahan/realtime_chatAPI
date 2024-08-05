import { Inject, Injectable } from '@nestjs/common';
import { FILE_REPOSITORY, SEQUELIZE } from 'src/core/constants';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class FilesService {
  constructor(
    @Inject(FILE_REPOSITORY)
    private readonly fileRepository: typeof File,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
  ) {}
}
