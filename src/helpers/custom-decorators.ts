import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/module/user/entities/user.entity';

export const UserSession = createParamDecorator<User | null>(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

export const Roles = Reflector.createDecorator<string[]>();
