import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    const SECRET_KEY = process.env.SECRET_KEY;
    try {
      const payload = jwt.verify(token, SECRET_KEY);
      const user = await this.prisma.users.findUnique({
        where: { id: +payload['id'] },
      });
      if (!user) {
        throw new NotFoundException();
      }
      delete user.password;
      request.user = user;
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (roles && roles.length > 0) {
        if (!roles.includes(user.role)) return false;
      }
    } catch (error) {
      if (error.name == 'TokenExpiredError') {
        throw new HttpException('Token expired', HttpStatus.FORBIDDEN);
      }
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
