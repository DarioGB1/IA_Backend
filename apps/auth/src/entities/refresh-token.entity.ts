
export interface RefreshTokenProps {
    id: string;
    userId: string;
    deviceId: string;
    ipAddress: string;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export class RefreshTokenEntity {
    id: string;
    userId: string;
    deviceId: string;
    ipAddress: string;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;

    constructor(props: RefreshTokenProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.deviceId = props.deviceId;
        this.ipAddress = props.ipAddress;
        this.expiresAt = props.expiresAt;
        this.revokedAt = props.revokedAt;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    get isExpired(): boolean {
        return this.expiresAt < new Date();
    }

    get isRevoked(): boolean {
        return this.revokedAt !== null;
    }
}