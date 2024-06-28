import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';
import { sessionMiddleware } from './modules/server/server.controller';
import { SocketIOAdapter } from './socket-io-adapter';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  console.log('starting on port:', port);
  // socket.io haric geriye kalan tum endpointlere prefix ekler
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidateInputPipe());

  //cors ayarlari
  app.enableCors({
    origin: [
      `http://localhost:${process.env.CLIENT_PORT}`,
      `http://localhost:${process.env.CLIENT_PORT + 1}`,
    ], // İzin verilen kökenler (frontend adresl eri)
    credentials: true, // Credential (örneğin cookie) desteği
  });

  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

  app.use(sessionMiddleware);

  await app.listen(port);
}
bootstrap();
