import * as bcrypt from 'bcrypt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordService } from '../auth/reset-password.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let prisma: PrismaService;
  let configService: ConfigService;
  let codeService: ResetPasswordService;

  const users = [
    {
      id: '0',
      email: 'user1@mail.com',
      password: '0000',
      fullname: 'user 1',
    },
    {
      id: '1',
      email: 'user2@mail.com',
      password: '1111',
      fullname: 'user 2',
    },
  ];

  beforeAll(async () => {
    configService = new ConfigService();
    prisma = new PrismaService({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
    userService = new UserService(prisma);
    codeService = new ResetPasswordService(prisma);
    controller = new UserController(userService, codeService, configService);

    await prisma.user.deleteMany();
    for (const user of users) {
      await prisma.user.create({
        data: user,
      });
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('get one user', async () => {
    const user = await controller.getUser(users[0].id);
    expect(user).toBeDefined();
  });

  it('should set user password', async () => {
    jest.spyOn(codeService, 'validateCode').mockReturnValue(true);
    jest
      .spyOn(codeService, 'getAssociatedEmail')
      .mockReturnValue(users[0].email);

    await controller.setPassword({
      code: 'fake code',
      password: 'new password',
    });

    const user = await prisma.user.findUnique({
      where: { id: users[0].id },
    });

    expect(bcrypt.compare('new password', user.password)).resolves.toBeTruthy();
  });
});
