// redis.module.ts
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { Module, DynamicModule } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({})
export class RedisModule {
    static register(redisUrl: string): DynamicModule {
        return {
            module: RedisModule,
            imports: [
                CacheModule.registerAsync({
                    useFactory: () => ({
                        store: redisStore,
                        url: redisUrl,
                    }),
                }),
            ],
            providers: [RedisService],
            exports: [RedisService],
        };
    }
}