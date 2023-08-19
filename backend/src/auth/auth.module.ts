import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { ResetPasswordService } from './reset-password.service';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ResetPasswordService, AuthGuard],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.ACCESS_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    MailModule,
  ],
  exports: [ResetPasswordService],
})
export class AuthModule {}
