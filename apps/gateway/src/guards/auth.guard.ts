import { AUTH_MS, AuthPattern } from '@app/shared';
import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

// Extend Express Request type using module augmentation
declare module 'express' {
    interface Request {
        payload?: Record<string, unknown>;
    }
}

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(@Inject(AUTH_MS) private readonly authMS: ClientProxy) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractToken(request);

        if (token === undefined || token === '') {
            throw new UnauthorizedException('No authorization token provided');
        }

        try {
            request.payload = await firstValueFrom(this.authMS.send<Record<string, unknown>>(AuthPattern.VALIDATE_TOKEN, token));
            return request.payload !== undefined && request.payload !== null && Object.keys(request.payload).length > 0;
        } catch (error: unknown) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }

            // Log unexpected errors and throw a generic auth error
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Authentication error: ${errorMessage}`);
            throw new UnauthorizedException('Authentication failed');
        }
    }

    private extractToken(request: Request): string | undefined {
        const headerToken = this.extractTokenFromHeader(request);
        if (typeof headerToken === 'string') return headerToken;
        return this.extractTokenFromCookie(request);
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.trim().split(' ') ?? [];
        return type === 'Bearer' && token ? token.trim() : undefined;
    }

    private extractTokenFromCookie(request: Request): string | undefined {
        const cookies = request.cookies as Record<string, string> | undefined;
        const accessToken = cookies?.accessToken;
        return typeof accessToken === 'string' && accessToken !== '' ? accessToken : undefined;
    }
}