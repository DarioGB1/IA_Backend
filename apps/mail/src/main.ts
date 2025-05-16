import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MailModule } from './mail.module';
import { Envs } from './config';
import { ExceptionInterceptor } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MailModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [Envs.NATS_SERVER],
      },
    },
  );

  app.useGlobalInterceptors(new ExceptionInterceptor());

  await app.listen();
}
bootstrap();
