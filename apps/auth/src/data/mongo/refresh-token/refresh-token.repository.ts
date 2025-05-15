import { Injectable } from '@nestjs/common';
import { RefreshTokenEntity } from 'apps/auth/src/entities/refresh-token.entity';
import { IRefreshTokenRepository } from 'apps/auth/src/interfaces/refresh-token.repository';
import { RefreshTokenDocument, RefreshToken } from './refresh-token.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshTokenCreateDto } from 'apps/auth/src/dtos/refresh-token-create.dto';
import { RefreshTokenUpdateDto } from 'apps/auth/src/dtos/refresh-token-update.dto';
import { BaseMongoRepository } from '@app/shared';

@Injectable()
export class MongoRefreshTokenRepository
  extends BaseMongoRepository<
    RefreshTokenEntity,
    RefreshTokenCreateDto,
    RefreshTokenUpdateDto,
    RefreshTokenDocument
  >
  implements IRefreshTokenRepository
{
  constructor(
    @InjectModel(RefreshToken.name)
    protected readonly model: Model<RefreshTokenDocument>,
  ) {
    super(model);
  }

  toEntity(document: RefreshTokenDocument): RefreshTokenEntity {
    return new RefreshTokenEntity({
      id: document._id,
      userId: document.userId,
      deviceId: document.deviceId,
      ipAddress: document.ipAddress,
      expiresAt: document.expiresAt,
      revokedAt: document.revokedAt,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }
}
