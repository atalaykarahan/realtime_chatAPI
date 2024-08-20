// redis.service.ts
import { Logger } from '@nestjs/common';
import { default as Redis } from 'ioredis';
import * as session from 'express-session';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RedisStore = require('connect-redis').default;

// Redis client
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

export { redisClient, RedisStore, session };
