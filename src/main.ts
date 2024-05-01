import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


const port = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log("starting on port:", port)


  app.setGlobalPrefix('api/v1');
  await app.listen(port);
}
bootstrap();
