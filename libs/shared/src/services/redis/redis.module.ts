// redis.module.ts
import { CacheModule } from '@nestjs/cache-manager';
import { Module, DynamicModule } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createKeyv } from '@keyv/redis';

@Module({})
export class RedisModule {
  static register(redisUrl: string): DynamicModule {
    return {
      module: RedisModule,
      imports: [
        CacheModule.registerAsync({
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
