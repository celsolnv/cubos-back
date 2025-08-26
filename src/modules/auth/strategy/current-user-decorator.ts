import { AuthenticatedJwtUser } from '@/types/modules/auth/signin-jwt-payload';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator<AuthenticatedJwtUser>(
  (_: unknown, ctx: ExecutionContext): AuthenticatedJwtUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
