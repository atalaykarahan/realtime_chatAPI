import { FriendsService } from './friends.service';
import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { friendsProviders } from './friends.providers';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../../core/database/database.module';

@Module({
  imports: [UsersModule, DatabaseModule],
  providers: [FriendsService, ...friendsProviders],
  exports: [FriendsService],
  controllers: [FriendController],
})
export class FriendsModule {}
