import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,

  ) {}

  public async validateUser(details: UserDto){
    console.log(details);
    console.log("validate user kısmına girdi")

    const user = await this.userService.findOneById(details.user_id);
    if(!user){
      // bu kisimda user yok ve oluşturulması icin jwt token dönülmeli
      const token = await this.generateToken(details);
      return {user: token, token: true};
    }else {
      // bu kisimda ise user var direkt olarak session yaratılmalı veya şimdilik user dönülebilir
      return {user: user, token: false};
    }

  }

  // public async validateUser(username: string, pass: string) {
  //   // find if user exist with this email
  //   const user = await this.userService.findOneByName(username);
  //   if (!user) {
  //     console.log("buraya düşüyor demektir")
  //     return null;
  //   }

  //   // find if user password match
  //   const match = await this.comparePassword(pass, user.user_password);
  //   if (!match) {
  //     return null;
  //   }

  //   // tslint:disable-next-line: no-string-literal
  //   const { user_password, ...result } = user['dataValues'];
  //   return result;
  // }

  // public async login(user) {
  //   const token = await this.generateToken(user);
  //   return { user, token };
  // }

  // public async create(user) {
  //   // hash the password
  //   // const pass = await this.hashPassword(user.user_password);

  //   // console.log("gelen password bu",pass)
  //   // // create the user
  //   // const newUser = await this.userService.create({
  //   //   ...user,
  //   //   user_password: pass,
  //   // });

  //   // tslint:disable-next-line: no-string-literal
  //   // const { user_password, ...result } = newUser['dataValues'];

  //   // generate token
  //   // const token = await this.generateToken(result);

  //   // // return the user and the token
  //   // return { user: result, token };
  // }

  private async generateToken(user:UserDto) {
    //burda tokena payload olarak user verilmis
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async comparePassword(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}
