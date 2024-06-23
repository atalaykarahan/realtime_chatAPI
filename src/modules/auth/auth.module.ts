import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';

import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [PassportModule, UsersModule, 
    JwtModule.register({
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
  })
  ],
  providers: [GoogleStrategy, AuthService, ],
  exports:[AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
