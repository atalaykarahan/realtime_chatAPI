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
  async redirect(@Req() req: any) {
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
      //yeni kayıt olmayacak giris yapicak olan kullanici bu kisma ugrayacak
      return { message: 'google auth' };
    }
  }
  //#endregion

  // api/v1/auth/signup | user come with token and userName
  //#region CREATE USERNAME AND SIGNUP
  //bu guardı daha sonra ac
  // @UseGuards(TokenCheck, DoesUserNameExist)
  @Post('signup')
  async signUp(
    @Body() req: any,
    @Session() session: Record<string, unknown>,
    @Headers('Authorization') authHeader: string,
  ) {
    console.log(req);
    const token = await this.jwtService.verifyAsync(authHeader);
    console.log(token);

    const userObj = {
      user_id: token.user_id,
      user_email: token.user_email,
      user_name: req.username,
      user_photo: token.user_photo
    }
    const createdUser = await this.authService.signUp(userObj);

    console.log(createdUser)

    // const myTest = {
    //   user_id: "431214515123",
    //   user_authority_id: 2,
    // }
    // session.user = myTest;
    // session.user = await this.userService.login(request);
    // session["alper"] = myTest;
    // const deneme = session["alper"];
    // user_id = session[req.session.user_id = 431214515123]
    // console.log("herhalde değeri var",deneme)


    //bu kisma bakarsin istersen baska bir sey dönersin
    // return req.session;
    return {message: "ok"}
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
