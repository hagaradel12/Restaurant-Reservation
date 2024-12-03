import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from Next.js server
    methods:'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });
  dotenv.config();
  await app.listen(3001);
}
bootstrap();
