import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { UsersService } from './modules/users/users.service';
import { sessionMiddleware, wrap } from './modules/server/server.controller';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);

  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = parseInt(this.configService.get('CLIENT_PORT'));

    const cors = {
      origin: [
        `http://localhost:${clientPort}`,
        `${process.env.FRONT_URL}`,
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
      ],
      credentials: true,
    };

    this.logger.log('Configuring SocketIO server with custom CORS options', {
      cors,
    });

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    // return super.createIOServer(port, optionsWithCORS);

    // const jwtService = this.app.get(JwtService);
    const userService = this.app.get(UsersService);
    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.of('chat').use(wrap(sessionMiddleware));
    server.of('chat').use(createSessionMiddleware(userService, this.logger));

    return server;
  }
}

const createSessionMiddleware =
  (userService: UsersService, logger: Logger) => (socket: any, next) => {
    // console.log('session bilgileri burda', socket.request.session);
    // console.log("handshake kısmı", socket.handshake.session)

    const userSession = socket.request.session.user;
    // console.log("usersession bu olmalı", userSession)

    logger.debug(`Validating user session before connection: ${userSession}`);

    if (!userSession) next(new Error('FORBIDDEN'));

    socket.user_id = userSession.id;
    socket.user_name = userSession.name;
    socket.user_mail = userSession.mail;
    socket.user_photo = userSession.photo;
    socket.user_role = userSession.role;
    next();
  };
