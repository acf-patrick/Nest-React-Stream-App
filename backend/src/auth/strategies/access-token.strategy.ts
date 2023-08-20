import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

type JwtPayload = {
  email: string;
};

@Injectable()
export class AccessTokenStartegy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_SECRET
    };
    super(options);
  }

  validate(payload: JwtPayload) {
    return payload; // content appended to request as "user" field
  }
}
