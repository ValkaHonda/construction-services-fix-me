import { ConfigService } from './config/config.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as helmet from 'helmet';
import express = require('express');
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.use(helmet());
  app.use('/public', express.static(join(__dirname, '..', 'public'))); // <- public directory
  await app.listen(app.get(ConfigService).port);
}
bootstrap();
