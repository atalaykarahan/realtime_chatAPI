import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import { UsersService } from './modules/users/users.service';

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
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
      ],
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

    // server.of('chat').use(createSessionMiddleware(userService, this.logger));

    return server;


    // return server;
  }

  
}

// const createSessionMiddleware =
//     (userService: UsersService, logger: Logger) =>
//     (socket: any, next) => {
//       console.log("session bilgileri burda", socket.request.session)
//       console.log("handshake kısmı", socket.handshake.session)

//       const userSession = socket.handshake.session.user;


//       logger.debug(`Validating user session before connection: ${userSession}`);

//       if (!userSession) next(new Error('FORBIDDEN'));

//       const user = userService.findOneById(userSession.session.user.id);

//       if (!user) next(new Error('FORBIDDEN'));

//       next();
//     };
