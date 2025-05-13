import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { Envs } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('IA LEARN')
    .setDescription('The IA LEARN API description')
    .setVersion('1.0')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  app.use('/api/doc', apiReference({
    spec: {
      content: documentFactory
    }
  }))

  app.useGlobalPipes(new ValidationPipe({
    // transform: true,
    whitelist: true,
    validateCustomDecorators: true,
    // forbidNonWhitelisted: true,
  }),
  )
  await app.listen(Envs.PORT ?? 3000);
}
bootstrap();
