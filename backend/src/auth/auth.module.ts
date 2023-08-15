import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { ResetPasswordService } from './reset-password.service';
import { JwtStrategy } from './strategies/jwt.strategy';

const jwtModule = JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '1h' },
});

@Module({
  controllers: [AuthController],
  providers: [AuthService, ResetPasswordService, JwtStrategy],
  imports: [PrismaModule, jwtModule, MailModule],
  exports: [jwtModule, ResetPasswordService],
})
export class AuthModule {}
