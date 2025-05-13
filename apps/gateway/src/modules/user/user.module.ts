import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { IDENTITY_ACCESS_MS } from '@app/shared';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserService } from './user.service';
import { Envs } from '../../config';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: IDENTITY_ACCESS_MS,
                transport: Transport.NATS,
                options: {
                    servers: Envs.NATS_SERVER,
                }
            },
        ]),
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule { }
