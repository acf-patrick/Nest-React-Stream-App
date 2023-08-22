import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    authService = new AuthService(
      new PrismaService({
        datasources: {
          db: {
            url:
          }
        }
      }),
      new JwtService({
        secret: "ACCESS_SECRET",
      }), null
    )
  });

  it('should be defined', () => {
    

  });
});
