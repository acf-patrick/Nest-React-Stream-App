import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getOne(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        email: true,
        fullname: true,
        id: true,
        avatar: true,
      },
    });
  }

  async getOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        fullname: true,
        id: true,
        avatar: true,
      },
    });
  }

  async setPassword(email: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException(`No user with email ${email} found`);
    }

    const salt = await bcrypt.genSalt();
    const encrypted = await bcrypt.hash(newPassword, salt);
    return await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        password: encrypted,
      },
      select: {
        email: true,
      },
    });
  }
}
