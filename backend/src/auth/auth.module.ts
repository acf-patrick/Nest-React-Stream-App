import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { ResetPasswordService } from './reset-password.service';
import { AccessTokenStartegy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    ResetPasswordService,
    AccessTokenStartegy,
    RefreshTokenStrategy,
  ],
  imports: [
    PrismaModule,
    MailModule,
    JwtModule.register({
      secret: process.env.ACCESS_SECRET,
    }),
  ],
  exports: [ResetPasswordService],
})
export class AuthModule {}
