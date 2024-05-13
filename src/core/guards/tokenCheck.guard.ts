import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../modules/users/users.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class TokenCheck implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request: any) {
    const token = request.headers.authorization;
    if (!token) return false;

    try {
      await this.jwtService.verifyAsync(token);
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new ForbiddenException('Token expired');

      throw error;
    }
  }
}
