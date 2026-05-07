import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from './user/user.service';
import { Request } from 'express';
import { Permission } from './user/entities/permission.entity';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(Reflector)
  private readonly reflector: Reflector;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('需要的权限:', requiredPermissions);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // 如果没有指定权限要求，直接放行
    }

    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true;
    }

    const userRoles = await this.userService.findRolesByRoleIds(user.roleIds);
    const userPermissions = userRoles.reduce((permissions: Permission[], role) => {
      return permissions.concat(role.permissions);
    }, []);

    console.log('用户权限列表:', userPermissions.map(p => p.name));

    const hasPermission = requiredPermissions.every(permission =>
      userPermissions.some(userPermission => userPermission.name === permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException("don't have permission");
    }

    return true;
  }
}
