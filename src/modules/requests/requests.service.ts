import { Inject, Injectable } from '@nestjs/common';
import { REQUEST_REPOSITORY } from '../../core/constants';
import { Request } from './request.entity';
import { RequestDto } from './dto/request.dto';

@Injectable()
export class RequestsService {
  constructor(
    @Inject(REQUEST_REPOSITORY)
    private readonly requestRepository: typeof Request,
  ) {}

  async create(request: RequestDto): Promise<boolean> {
    await this.requestRepository.create<Request>(request);
    return true;
  }
}
