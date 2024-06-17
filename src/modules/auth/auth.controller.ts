import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DoesUserNameExist } from 'src/core/guards/doesUserNameExist.guard';
import { Response } from 'express';
import { GoogleAuthGuard } from 'src/core/guards/googleAuth.guard';
import { TokenCheck } from 'src/core/guards/tokenCheck.guard';
import { AuthService } from './auth.service';
import { ValidSession } from 'src/core/guards/validSession.guard';

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
  async redirect(
    @Req() req: any,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    /* burda req.user kullanilmali
     * yoksa tum req herseyiyle geliyor
     * bunun icinde 2 adet obje var biri user digeri token */
    const returnObject = req.user;
    //eger kullanici kayitli degil ise token donuyoruz
    if (returnObject.token) {
      const redirectUrl = `${process.env.FRONT_URL}/createname?token=${returnObject.user}`;
      res.redirect(redirectUrl);
    } else {
      //kullanici basarili bir sekilde giris yapmis demektir
      session.user = {
        id: returnObject.user.user_id,
        mail: returnObject.user.user_email,
        role: returnObject.user.user_role,
      };
      res.redirect(`${process.env.FRONT_URL}/chat`);
    }
  }
  //#endregion

  // api/v1/auth/signup | user come with token and userName
  //#region CREATE USERNAME AND SIGNUP
  @UseGuards(TokenCheck, DoesUserNameExist)
  @Post('signup')
  async signUp(
    @Body() req: any,
    @Res() res: Response,
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

    return res.status(HttpStatus.CREATED).json(createdUser);
    // res.redirect(`${process.env.FRONT_URL}/chat`);
  }
  //#endregion

  //#region chech if user has a valid session
  @UseGuards(ValidSession)
  @Get()
  async getAuthenticatedUser(@Session() session: Record<string, unknown>) {
    return session.user;
  }
  //#endregion
}
