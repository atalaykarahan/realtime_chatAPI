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
  @UseGuards(AuthGuard('google'))
  @Get('login')
  async login(@Req() req) {
    return { msg: 'Google authentication' };
  }

  // api/v1/auth/redirect
  @UseGuards(AuthGuard('google'))
  @Get('redirect')
  async redirect(@Req() req) {

    return { msg: 'Google authentication' };
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
