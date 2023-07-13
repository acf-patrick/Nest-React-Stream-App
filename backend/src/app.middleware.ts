import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UserService } from './user/user.service';

interface UserRequest extends Request {
  userId: string;
}

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: UserRequest, res: Response, next: NextFunction) {
    try {
      // check request headers
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        const token = req.headers.authorization.split(' ')[1];
        const { email } = await this.jwt.verify(token);
        const user = await this.userService.getOne(email);
        if (user) {
          req.userId = user.id;
          next();
        } else {
          throw new UnauthorizedException('Unauthorized');
        }
      } else {
        throw new BadRequestException('No token found');
      }
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
