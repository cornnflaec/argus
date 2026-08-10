import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies?.argus_session;

    if (!token) {
      throw new UnauthorizedException(
        'Authentication required',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
      );

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired session',
      );
    }
  }
}