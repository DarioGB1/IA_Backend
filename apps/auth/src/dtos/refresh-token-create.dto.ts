export interface RefreshTokenCreateDto {
  userId: string;
  deviceId: string;
  ipAddress: string;
  expiresAt: Date;
}
