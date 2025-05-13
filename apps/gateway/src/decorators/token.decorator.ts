import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Token = createParamDecorator(
    (property: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();
        const payload = request.payload!;
        return property ? payload?.[property] : payload;
    },
);
