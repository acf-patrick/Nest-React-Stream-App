import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;
  let configService: ConfigService;

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
    service = new UserService(prisma);

    await prisma.user.deleteMany();
    for (const user of users) {
      await prisma.user.create({
        data: user,
      });
    }
  });

  it('should be defined', () => {
    [configService, prisma, service].forEach((service) =>
      expect(service).toBeDefined(),
    );
  });

  it('get one user by ID', async () => {
    const user = await service.getOne(users[0].id);
    expect(user).toBeTruthy();
  });

  it('get one user by email', async () => {
    const user = await service.getOneByEmail(users[0].email);
    expect(user).toBeTruthy();
  });

  it('should set one user password', async () => {
    const newPassword = 'new password';
    const res = await service.setPassword(users[0].email, newPassword);
    expect(res).toBeTruthy();

    const user = await prisma.user.findUnique({
      where: { id: users[0].id },
    });

    expect(bcrypt.compare(newPassword, user.password)).resolves.toBeTruthy();
  });
});
