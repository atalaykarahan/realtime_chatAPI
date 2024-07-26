import { RequestsService } from './requests.service';
import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { requestsProviders } from './requests.providers';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [RequestsService, ...requestsProviders],
  exports: [RequestsService],
  controllers: [RequestController],
})
export class RequestsModule {}
