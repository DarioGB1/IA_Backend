import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Envs } from './config';
import { AUTH_MS } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [Envs.NATS_SERVER],
        queue: AUTH_MS,
      },
    },
  );
  await app.listen();
}
bootstrap();
