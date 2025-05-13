import { createKeyv } from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { DynamicModule, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";

@Module({})
export class RedisModule {
    static register(redisUrl: string): DynamicModule {
        return {
            module: RedisModule,
            imports: [
                CacheModule.register({
                    useFactory: () => ({
                        stores: [createKeyv(redisUrl)],
                    }),
                }),
            ],
            providers: [RedisService],
            exports: [RedisService],
        };
    }
}