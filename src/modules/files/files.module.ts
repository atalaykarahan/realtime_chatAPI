import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileController } from './file.controller';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../../core/database/database.module';
import { filesProviders } from './files.providers';

@Module({
  imports: [UsersModule, DatabaseModule],
  providers: [FilesService, ...filesProviders],
  exports: [FilesService],
  controllers: [FileController],
})
export class FilesModule {}
