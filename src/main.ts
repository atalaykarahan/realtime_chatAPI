import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import env from "./util/validateEnv"

const port = env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log("starting on port:", port)
  await app.listen(port);
}
bootstrap();
