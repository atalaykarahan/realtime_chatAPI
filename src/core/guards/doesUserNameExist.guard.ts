import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../modules/users/users.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

//if user select same username we return error
@Injectable()
export class DoesUserNameExist implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request: any) {
    //check if user send a username

    if (request.body.username) {
      //search same username
      const userNameExist = await this.userService.findOneByName(
        request.body.username,
      );
      //if username exist than we send a error
      if (userNameExist)
        throw new ConflictException('This username already exists');
      return true;
    }
    throw new ForbiddenException('Username does not exist');
  }
}
