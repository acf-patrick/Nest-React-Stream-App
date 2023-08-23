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
    prisma = {
      user: {
        findUnique: jest
          .fn()
          .mockImplementation(
            async (query: { where: { id: string } | { email: string } }) =>
              users.find((user) =>
                query.where['id']
                  ? user.id === query.where['id']
                  : user.email === query.where['email'],
              ),
          ),
        update: jest.fn(),
      },
    } as unknown as PrismaService;

    codeService = {
      validateCode: jest.fn().mockReturnValue(true),
      getAssociatedEmail: jest.fn().mockReturnValue(users[0].email),
    } as unknown as ResetPasswordService;

    userService = new UserService(prisma);
    controller = new UserController(userService, codeService, configService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('get one user', async () => {
    await expect(controller.getUser(users[0].id)).resolves.toBeDefined();
  });

  it('should set user password', async () => {
    await controller.setPassword({
      code: '0000',
      password: 'new password',
    });

    const query = jest.spyOn(prisma.user, 'update').mock.calls[0][0];
    await expect(
      bcrypt.compare('new password', query.data.password as string),
    ).resolves.toBeTruthy();
  });
});
