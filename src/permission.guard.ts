import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from './user/user.service';
import { Request } from 'express';
import { Permission } from './user/entities/permission.entity';
import { Reflector } from '@nestjs/core';
import { RedisService } from './redis/redis.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(Reflector)
  private readonly reflector: Reflector;

  @Inject(RedisService)
  private readonly redisService: RedisService;

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

    const redisKey = `user_permissions:${user.username}`;
    let userPermissions: Permission[] = [];
    const cachedPermissions = await this.redisService.get(redisKey);

    if (cachedPermissions) {
      userPermissions = JSON.parse(cachedPermissions);
      console.log('从 Redis 缓存获取权限:', userPermissions.map(p => p.name));
    } else {
      const userRoles = await this.userService.findRolesByRoleIds(user.roleIds);
      userPermissions = userRoles.reduce((permissions: Permission[], role) => {
        return permissions.concat(role.permissions);
      }, []);

      await this.redisService.set(redisKey, JSON.stringify(userPermissions), 60 * 60); // 缓存 1 小时
      console.log('从数据库查询并添加缓存:', userPermissions.map(p => p.name));
    }

    const hasPermission = requiredPermissions.every(permission =>
      userPermissions.some(userPermission => userPermission.name === permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException("don't have permission");
    }

    return true;
  }
}
