import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import CryptoHelper from 'src/helpers/crypto-helper';
import AuthGuardSetting from './setting.guard';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService) { }

  async canActivate(
    context: ExecutionContext,
  ) {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    const isExcluded = this.isExcluded(request.path);

    if (!token && !isExcluded) {
      throw new UnauthorizedException();
    }

    if (isExcluded) {
      return true;
    }

    await CryptoHelper.verifyToken(this.jwtService, token);

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isExcluded(path: string) {
    for (const excludedPath of AuthGuardSetting.excludedPaths) {
      const pattern = new RegExp(excludedPath);
      if (pattern.test(path)) {
        return true;
      }
    }

    return false;
  }
}
