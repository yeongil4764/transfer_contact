import { User } from '.prisma/client';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const controllerRole = this.reflector.get<string>(
      'roles',
      context.getClass(),
    );
    const functionRole = this.reflector.get<string>(
      'roles',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (controllerRole) {
      if (functionRole) {
        return user.role.some((role) => role === functionRole);
      } else {
        return user.role.some((role) => role === controllerRole);
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
