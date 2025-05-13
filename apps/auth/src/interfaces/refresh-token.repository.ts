import { RefreshTokenCreateDto } from "../dtos/refresh-token-create.dto";
import { RefreshTokenUpdateDto } from "../dtos/refresh-token-update.dto";
import { RefreshTokenEntity } from "../entities/refresh-token.entity";
import { IBaseRepository } from "@app/shared/interfaces/repository/base.interface";

export const REFRESH_TOKEN_REPOSITORY = "REFRESH_TOKEN_REPOSITORY"
export interface IRefreshTokenRepository extends IBaseRepository<RefreshTokenEntity, RefreshTokenCreateDto, RefreshTokenUpdateDto> {
}