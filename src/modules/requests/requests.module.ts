import { RequestsService } from './requests.service';
import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { requestsProviders } from './requests.providers';
import { UsersModule } from '../users/users.module';
import { FriendsModule } from '../friends/friends.module';
import { DatabaseModule } from '../../core/database/database.module';

@Module({
  imports: [UsersModule, FriendsModule, DatabaseModule],
  providers: [RequestsService, ...requestsProviders],
  exports: [RequestsService],
  controllers: [RequestController],
})
export class RequestsModule {}
