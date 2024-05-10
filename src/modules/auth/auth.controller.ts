import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '../users/dto/user.dto';
import { DoesUserExist } from 'src/core/guards/doesUserExist.guard';
import { GoogleAuthGuard } from 'src/core/guards/googleAuth.guard';
import { AppService } from 'src/app.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // api/v1/auth/login
  @UseGuards(GoogleAuthGuard)
  @Get('login')
  async login() {
    return { msg: 'Google authentication' };
  }

  // api/v1/auth/redirect
  @UseGuards(GoogleAuthGuard)
  @Get('redirect')
  async redirect(@Req() req:any) {
    const userObject = req.user;
    //token degeri true ise user yeni kayit olucak demektir
    if (userObject.token) {
      return {
        code: 200,
        status: 'OK',
        message: 'Token created for new user',
        token: userObject.user,
      };
    } else {
      return { message: 'google auth' };
    }
  }

  // @UseGuards(AuthGuard('local'))
  // @Post('login')
  // async login(@Request() req) {
  //     return await this.authService.login(req.user);
  // }

  // @UseGuards(DoesUserExist)
  // @Post('signup')
  // async signUp(@Body() user: UserDto) {
  //     return await this.authService.create(user);
  // }
}
