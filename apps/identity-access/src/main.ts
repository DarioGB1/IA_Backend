import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { IdentityAccessModule } from './identity-access.module';
import { IDENTITY_ACCESS_MS } from '@app/shared';
import { Envs } from './config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    IdentityAccessModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [Envs.NATS_SERVER],
        queue: IDENTITY_ACCESS_MS,
      },
    },
  );
  await app.listen();
}
bootstrap();
