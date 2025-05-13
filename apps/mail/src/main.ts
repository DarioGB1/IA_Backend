import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MailModule } from './mail.module';
import { Envs } from './config';

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
  await app.listen();
}
bootstrap();
