import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:9898/api/v1/auth/redirect',
      scope: ['email','profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<any> {
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
      
      const {name, emails, photos} = profile
      const user ={
        email: emails[0].value,
        firstName:name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
        accessToken
      }
      done(null,user)


  }
}
