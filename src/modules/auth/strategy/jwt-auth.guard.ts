import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { environmentVariables } from 'src/config/environment-variables';
import { UsersService } from '@/modules/users/users.service';
import { AuthenticatedJwtUser } from 'src/types/modules/auth/signin-jwt-payload';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const Private = () => SetMetadata(IS_PUBLIC_KEY, false);

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { id } = await this.jwtService.verifyAsync(token, {
        secret: environmentVariables.JWT_SECRET,
      });

      const user = await this.usersService.findById({
        id,
        mode: 'ensureExistence',
      });

      const authenticatedUser: AuthenticatedJwtUser = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      request['user'] = authenticatedUser;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
