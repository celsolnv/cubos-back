import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { environmentVariables } from './config/environment-variables';
import { setupSwaggerDocs } from './config/setup-docs';
import AppException from './exception-filters/app-exception/app-exception';
import { getAllValidationErrorConstraints } from './utils/helpers/get-all-validation-error-constraints';
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as express from 'express';
import * as cors from 'cors';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.enableCors({
    origin: true, // ou ['http://localhost:3000'] para desenvolvimento
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.use(
    '/files/public',
    express.static(path.resolve(__dirname, '..', 'files', 'public')),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // switch to true to remove unknown properties
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const constraints = getAllValidationErrorConstraints(validationErrors);
        return new AppException(constraints.join('; '), 400);
      },
    }),
  );

  if (environmentVariables.SHOW_DOCS) {
    setupSwaggerDocs(app);
  }

  app.use(helmet());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(morgan('combined'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
