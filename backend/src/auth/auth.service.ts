import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignupUserDto } from './dto/signup-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(signupUserDto: SignupUserDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(signupUserDto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        fullname: signupUserDto.fullname,
        email: signupUserDto.email,
        password: hash,
      },
      select: {
        id: true,
        email: true,
        fullname: true,
      },
    });
    return user;
  }

  async refreshTokens(refreshToken: string) {
    const record = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!record) {
      throw new BadRequestException('Invalid refresh token');
    }

    await this.prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken,
      },
    });

    refreshToken = await this.generateRefreshToken(
      record.email,
      record.ipAddress,
      record.userAgent,
    );

    const accessToken = await this.generateAccessToken(record.email);
    return {
      refreshToken,
      accessToken,
    };
  }

  async generateAccessToken(email: string) {
    const token = await this.jwt.signAsync(
      {
        email,
      },
      {
        expiresIn: '1h',
      },
    );
    return token;
  }

  async invalidateRefreshToken(
    email: string,
    ipAddress: string,
    userAgent: string,
  ) {
    try {
      const res = await this.prisma.refreshToken.delete({
        where: {
          ipAddress_userAgent_email: {
            ipAddress,
            userAgent,
            email,
          },
        },
      });
      return res;
    } catch {
      return null;
    }
  }

  /**
   * Return existing refresh-token for this user or create a new one
   * Create a JWT token with email, ip address, user agent as payload
   */
  async generateRefreshToken(
    email: string,
    ipAddress: string,
    userAgent: string,
  ) {
    const refreshToken = this.jwt.sign(
      {
        ipAddress,
        userAgent,
        email,
      },
      {
        expiresIn: '1d',
        secret: this.configService.get<string>('REFRESH_SECRET'),
      },
    );

    let record = await this.prisma.refreshToken.findUnique({
      where: {
        ipAddress_userAgent_email: {
          email,
          userAgent,
          ipAddress,
        },
      },
    });
    if (record) {
      return record.token;
    }

    record = await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        ipAddress,
        userAgent,
        email,
      },
    });

    return refreshToken;
  }

  async signin(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        password: true,
        id: true,
      },
    });

    if (user) {
      try {
        const res = await bcrypt.compare(password, user.password);
        if (res) {
          const token = await this.generateAccessToken(email);
          return {
            token,
            id: user.id,
          };
        }
      } catch (e) {
        console.error(e);
      }
    }

    throw new UnauthorizedException('Incorrect email or password');
  }
}
