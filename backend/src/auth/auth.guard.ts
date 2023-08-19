import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = ctx.switchToHttp().getRequest<Request & { userId: string }>();
    const verify = async () => {
      try {
        // check request headers
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith('Bearer')
        ) {
          const token = req.headers.authorization.split(' ')[1];
          const { email } = await this.jwt.verify(token);
          const user = await this.prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (user) {
            req.userId = user.id;
            return true;
          } else {
            return false;
          }
        } else {
          throw new BadRequestException('No token found');
        }
      } catch (e) {
        if (!(e instanceof HttpException)) {
          return false;
        }
      }
    };

    return verify();
  }
}
