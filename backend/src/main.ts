import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();  // Load environment variables first

  const app = await NestFactory.create(AppModule);

  // Use cookie-parser middleware before enabling CORS
  app.use(cookieParser());

  // Enable CORS with proper origin and credentials settings
  app.enableCors({
    origin: 'http://localhost:3000', // Ensure this matches the actual origin of your frontend
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true, // Allow cookies to be sent/received
  });

  // Listen on the desired port
  await app.listen(3001);
}

bootstrap();
