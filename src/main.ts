import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';
import * as session from 'express-session';
import * as createRedisStore from 'connect-redis';
// import connectRedis from 'connect-redis';
import { default as Redis } from 'ioredis';
import {ConfigService} from '@nestjs/config';
import {createClient} from 'redis';
import { Logger } from '@nestjs/common';
import passport from 'passport';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const RedisStore = connectRedis(session); 
  // const RedisStore = require("connect-redis").default;
  // const redisClient = new Redis()
  const configService = app.get(ConfigService);

  const RedisStore = require("connect-redis").default;
  const redisHost: string = configService.get('REDIS_HOST');
  const redisPort: number = configService.get('REDIS_PORT');
  const redisClient = new Redis({
    host: "127.0.0.1",
    port: 6379,
  });

  redisClient.on('error', (err) =>
    Logger.error('Could not establish a connection with redis. ' + err)
  );
  redisClient.on('connect', () =>
    Logger.verbose('Connected to redis successfully')
  );

  console.log("starting on port:", port)
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidateInputPipe());


  app.use(
    session({
      store: new RedisStore({client: redisClient as any}),
      secret: "asdfasdgasdfas",
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite : "strict",
        domain:"localhost",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 * 99999,
      },
      rolling:true,
    }),
  );

  // app.use(passport.initialize());
  // app.use(passport.session());



  // app.use(
  //   session({
  //     store: new RedisStore({ client: redisClient, url: "redis://atalay:test@localhost:63799443" }),
  //     saveUninitialized: false,
  //     secret: 'testdenemeee',
  //     resave: false,
  //     cookie: {
  //       sameSite: true,
  //       httpOnly: false,
  //       maxAge: 60000,
  //     },
  //   }),
  // );
  await app.listen(port);
}
bootstrap();
