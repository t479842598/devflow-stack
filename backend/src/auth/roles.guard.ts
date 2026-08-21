import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.get<string[]>(
      'roles',
      ctx.getHandler(),
    );
    if (!required || required.length === 0) return true;
    const { user } = ctx.switchToHttp().getRequest();
    if (!user) return false;
    if (!required.includes(user.role)) {
      throw new ForbiddenException('需要 ' + required.join('/') + ' 角色');
    }
    return true;
  }
}
