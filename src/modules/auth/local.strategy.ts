import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super();
    }

    // async validate(user_name: string, user_password: string): Promise<any>{
    //     const user = await this.authService.validateUser(user_name, user_password);

    //     if (!user) {
    //      throw new UnauthorizedException('Invalid user credentials');
    //     }
    //     return user;
    // }
}