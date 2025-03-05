import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:3000", // ✅ Allow frontend access
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // ✅ Keeps authentication working
  });

  await app.listen(4000);
}
bootstrap();
