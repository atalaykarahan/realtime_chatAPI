import { Logger } from '@nestjs/common';
import * as session from 'express-session';
import { default as Redis } from 'ioredis';

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

export const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient as any }),
  secret: 'wubbalubbadubdub',
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
});

//socket io icin gerekli olan middleware
export const wrap = (expressMiddlaware) => (socket, next) => {
  expressMiddlaware(socket.request, {}, next);
};
