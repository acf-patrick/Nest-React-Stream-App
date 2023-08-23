import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, RefreshToken } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let jwt: JwtService;
  let configService: ConfigService;
  let prisma: DeepMockProxy<PrismaClient>;

  const user = {
    email: 'user@mail.com',
    password: 'password',
    fullname: 'user',
  };

  beforeAll(async () => {
    prisma = mockDeep<PrismaClient>();
    jwt = new JwtService({ secret: 'ACCES_TOKEN' });
    configService = {
      get: jest.fn().mockReturnValue('REFRESH_TOKEN'),
    } as unknown as ConfigService;

    service = new AuthService(
      prisma as unknown as PrismaService,
      jwt,
      configService,
    );
  });

  beforeEach(() => {
    mockReset(prisma);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sign up user', async () => {
    const record: User = {
      ...user,
      avatar: null,
      createdDate: new Date(),
      id: '',
    };
    prisma.user.create.mockResolvedValue(record);
    await expect(service.signup(user)).resolves.toBe(record);

    const query = prisma.user.create.mock.calls[0][0];
    await expect(
      bcrypt.compare(user.password, query.data.password),
    ).resolves.toBeTruthy();
  });

  it('sign in user', async () => {
    const salt = await bcrypt.genSalt();
    const hashedPwd = await bcrypt.hash(user.password, salt);

    const record: User = {
      avatar: null,
      createdDate: new Date(),
      email: user.email,
      fullname: user.fullname,
      id: '',
      password: hashedPwd,
    };
    prisma.user.findUnique.mockResolvedValue(record);

    const res = await service.signin(user.email, user.password);
    const { email } = jwt.verify(res.token);

    expect(email).toBe(user.email);
  });

  it('should returns new tokens', async () => {
    const refreshToken = 'REFRESH_TOKEN';
    const record: RefreshToken = {
      email: 'user@mail.com',
      ipAddress: '0.0.0.0',
      token: refreshToken,
      userAgent: '',
    };
    prisma.refreshToken.findUnique.mockResolvedValueOnce(record);

    const res = await service.refreshTokens(refreshToken);
    expect(res.refreshToken !== refreshToken).toBeTruthy();
  });

  it('generate access token', async () => {
    const user = {
      email: 'user@mail.com',
    };
    const token = await service.generateAccessToken(user.email);
    expect(jwt.verify(token)).toHaveProperty('email');
  });

  it('should return existing refresh token', async () => {
    const record: RefreshToken = {
      token: 'REFRESH_TOKEN',
      email: '',
      ipAddress: '',
      userAgent: '',
    };
    prisma.refreshToken.findUnique.mockResolvedValue(record);

    await expect(
      service.generateRefreshToken('user@mail.com', '0.0.0.0', ''),
    ).resolves.toBe(record.token);
  });

  it('should generate new refresh token', async () => {
    const record: RefreshToken = {
      email: 'user@mail.com',
      ipAddress: '0.0.0.0',
      token: 'REFRESH_TOKEN',
      userAgent: '',
    };
    prisma.refreshToken.findUnique.mockResolvedValue(null);

    const token = await service.generateRefreshToken(
      record.email,
      record.ipAddress,
      record.userAgent,
    );

    const payload = jwt.verify(token, {
      secret: configService.get('REFRESH_TOKEN'),
    });
    expect({
      ...payload,
      token: record.token,
    }).toMatchObject(record);
  });

  it('invalidate a refresh token', async () => {
    await expect(
      service.invalidateRefreshToken('user@mail.com', '0.0.0.0', ''),
    ).resolves.toBeUndefined();
  });
});
