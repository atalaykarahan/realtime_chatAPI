import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../modules/users/users.service';

// control if user has a valid session
@Injectable()
export class ValidSession implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return this.validateRequest(req);
  }

  async validateRequest(req) {
    if (!req.session.user)
      throw new UnauthorizedException('User is not authenticated');

    const user = await this.userService.findOneById(req.session.user.id);

    if (!user) throw new UnauthorizedException('User is not authenticated');

    return true;
  }
}
