import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log("starting on port:", port)


  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidateInputPipe());
  await app.listen(port);
}
bootstrap();
