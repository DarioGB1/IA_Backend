import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Request } from 'express';

export const DeviceId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Promise<string> => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const deviceId = request.headers['x-device-id'];
    if (
      deviceId === undefined ||
      typeof deviceId !== 'string' ||
      deviceId.trim() === ''
    ) {
      throw new BadRequestException('X-Device-Id header is required');
    }

    return new ParseUUIDPipe()
      .transform(deviceId, {
        type: 'custom',
        metatype: String,
        data: 'X-Device-Id',
      })
      .catch(() => {
        throw new BadRequestException(
          'X-Device-Id header must be a valid UUID',
        );
      });
  },
);
