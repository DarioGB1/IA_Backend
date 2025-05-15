import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async set(
    key: string,
    value: string,
    expiresInMinutes: number = 15,
  ): Promise<void> {
    await this.cache.set(key, value, expiresInMinutes * 60 * 1000);
  }

  async get(key: string): Promise<string | null> {
    return await this.cache.get<string>(key);
  }

  async delete(key: string): Promise<void> {
    await this.cache.del(key);
  }
}
