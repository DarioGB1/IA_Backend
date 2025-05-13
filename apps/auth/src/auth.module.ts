import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './aut.service';
import { DataModule } from './data/data.module';
import { TokenModule } from './services/token/token.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IDENTITY_ACCESS_MS, MAIL_MS } from '@app/shared';
import { Envs } from './config';

@Module({
  imports: [
    DataModule,
    ClientsModule.register([
      {
        name: MAIL_MS,
        transport: Transport.NATS,
        options: {
          servers: Envs.NATS_SERVER,
        }
      },
      {
        name: IDENTITY_ACCESS_MS,
        transport: Transport.NATS,
        options: {
          servers: Envs.NATS_SERVER,
        }
      },
    ]),
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
