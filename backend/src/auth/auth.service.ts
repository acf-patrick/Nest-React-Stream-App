import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignupUserDto } from './dto/signup-user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signup(signupUserDto: SignupUserDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(signupUserDto.password, salt);
    return await this.prisma.user.create({
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
  }

  async signin(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      try {
        const res = await bcrypt.compare(password, user.password);
        if (res) {
          const payload = { email };
          return {
            token: this.jwt.sign(payload),
          };
        }
      } catch (e) {
        console.error(e);
      }
    }

    throw new UnauthorizedException('Incorrect email or password');
  }
}
