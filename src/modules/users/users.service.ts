import { Inject, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from 'src/core/constants';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(user: UserDto): Promise<User> {
    return await this.userRepository.create<User>(user);
  }

  async findOneByEmail(user_email: string): Promise<User> {
    return await this.userRepository.findOne<User>({
      where: { user_email },
    });
  }

  async findOneByName(user_name: string): Promise<User> {
    return await this.userRepository.findOne<User>({
      where: { user_name },
    });
  }

  async findOneById(id: string): Promise<User> {
    return await this.userRepository.findByPk<User>(id);
  }
}
