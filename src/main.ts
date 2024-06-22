import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';
// import connectRedis from 'connect-redis';
import { Logger } from '@nestjs/common';
import { default as Redis } from 'ioredis';
import { SocketIOAdapter } from './socket-io-adapter';
import { ConfigService } from '@nestjs/config';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const RedisStore = require('connect-redis').default;
  const redisClient = new Redis({
    host: '127.0.0.1',
    port: 6379,
  });

  redisClient.on('error', (err) =>
    Logger.error('Could not establish a connection with redis. ' + err),
  );
  redisClient.on('connect', () =>
    Logger.verbose('Connected to redis successfully'),
  );

  console.log('starting on port:', port);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidateInputPipe());

  app.enableCors({
    origin: [
      `http://localhost:${process.env.CLIENT_PORT}`,
      'https://example.com',
    ], // İzin verilen kökenler (frontend adresleri)
    credentials: true, // Credential (örneğin cookie) desteği
  });

  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

  app.use(
    session({
      store: new RedisStore({ client: redisClient as any }),
      secret: 'asdfasdgasdfas',
      resave: false,
      saveUninitialized: false,
      name: process.env.COOKIE_NAME,
      cookie: {
        sameSite: 'strict',
        domain: 'localhost',
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 * 99999,
      },
      rolling: true,
    }),
  );

  await app.listen(port);
}
bootstrap();
