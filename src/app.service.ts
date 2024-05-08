import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello test!';
  }

  googleLogin(req){
    if(!req.user){
      return "no user for google"
    }
    return {
      message: "user info from google",
      user: req.user
    }
  }
}
