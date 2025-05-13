import { IsDate, IsString } from "class-validator";

export class RefreshTokenUpdateDto {
    @IsString()
    @IsDate()
    revokedAt: Date;
}