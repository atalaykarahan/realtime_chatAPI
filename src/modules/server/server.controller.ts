import * as session from 'express-session';
import { redisClient, RedisStore } from '../redis/redis.service';

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
