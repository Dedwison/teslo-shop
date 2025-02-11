import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../../auth/entities/user.entity';
import { META_ROLES } from '../../auth/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.getAllAndMerge(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('UserRoleGuard validRoles:', validRoles);
    console.log('META_ROLES', META_ROLES);

    if (!validRoles) return true; /// Si no hay roles definidos, permite el acceso
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new BadRequestException('User not found');

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }
    throw new BadRequestException(
      `User ${user.fullName} need a valid role: [${validRoles}]`,
    );
  }
}
