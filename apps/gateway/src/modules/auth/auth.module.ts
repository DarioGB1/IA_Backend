import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AUTH_MS, IDENTITY_ACCESS_MS, } from '@app/shared';
import { Envs } from '../../config';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: AUTH_MS,
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
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }
