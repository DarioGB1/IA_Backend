import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { Envs } from './config';
import { RpcExceptionFilter } from './common';
import { ExceptionInterceptor } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.enableCors({
    origin: Envs.ORIGINS,
    methods: Envs.METHODS,
    credentials: true,
    allowedHeaders: Envs.ALLOWED_HEADERS,
  });

  const config = new DocumentBuilder()
    .setTitle('IA LEARN :D')
    .setDescription('The IA LEARN API description')
    .setVersion('1.0')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  app.use(
    '/api/doc',
    apiReference({
      spec: {
        content: documentFactory,
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      // transform: true,
      whitelist: true,
      validateCustomDecorators: true,
      // forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ExceptionInterceptor());

  app.useGlobalFilters(new RpcExceptionFilter());

  await app.listen(Envs.PORT ?? 3000);
}
bootstrap();
