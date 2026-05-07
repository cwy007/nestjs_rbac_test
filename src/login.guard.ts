import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class LoginGuard implements CanActivate {

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(Reflector)
  private readonly reflector: Reflector;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requireLogin = this.reflector.getAllAndOverride<boolean>('requireLogin', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireLogin) {
      return true; // 如果不需要登录，直接放行
    }

    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded.user; // 将解码后的用户信息附加到请求对象上
      return true;
    } catch (err) {
      throw new UnauthorizedException('user not logged in');
    }
  }
}