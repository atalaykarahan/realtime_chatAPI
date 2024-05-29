import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Req,
  Headers,
  Session,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '../users/dto/user.dto';
import { DoesUserExist } from 'src/core/guards/doesUserExist.guard';
import { GoogleAuthGuard } from 'src/core/guards/googleAuth.guard';
import { AppService } from 'src/app.service';
import { TokenCheck } from 'src/core/guards/tokenCheck.guard';
import { DoesUserNameExist } from 'src/core/guards/doesUserNameExist.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  // api/v1/auth/login
  //#region GOOGLE LOGIN
  @UseGuards(GoogleAuthGuard)
  @Get('login')
  async login() {
    return { msg: 'Google authentication' };
  }
  //#endregion

  // api/v1/auth/redirect
  //#region GOOGLE CALLBACK
  @UseGuards(GoogleAuthGuard)
  @Get('redirect')
  async redirect(@Req() req: any, @Session() session: Record<string, any>) {
    /* burda req.user kullanilmali
     * yoksa tum req herseyiyle geliyor
     * bunun icinde 2 adet obje var biri user digeri token */
    const returnObject = req.user;
    if (returnObject.token) {
      return {
        code: 200,
        status: 'OK',
        message: 'Token created for new user',
        token: returnObject.user,
      };
    } else {
      //kullanici basarili bir sekilde giris yapmis demektir
      session.user = {
        id: returnObject.user.user_id,
        mail: returnObject.user.user_email,
        role: returnObject.user.user_role,
      };
      return returnObject.user;
    }
  }
  //#endregion

  // api/v1/auth/signup | user come with token and userName
  //#region CREATE USERNAME AND SIGNUP
  @UseGuards(TokenCheck, DoesUserNameExist)
  @Post('signup')
  async signUp(
    @Body() req: any,
    @Session() session: Record<string, unknown>,
    @Headers('Authorization') authHeader: string,
  ) {
    const token = await this.jwtService.verifyAsync(authHeader);

    const userObj = {
      user_id: token.user_id,
      user_email: token.user_email,
      user_name: req.username,
      user_photo: token.user_photo,
    };
    const createdUser = await this.authService.signUp(userObj);

    if (!createdUser)
      throw new HttpException(
        'User could not be created',
        HttpStatus.BAD_REQUEST,
      );

    session.user = {
      id: createdUser.user_id,
      mail: createdUser.user_email,
      role: createdUser.user_role,
    };
    return createdUser;
  }
  //#endregion

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
