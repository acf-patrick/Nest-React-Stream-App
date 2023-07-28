import {
  Controller,
  HttpCode,
  Post,
  Body,
  UseFilters,
  ServiceUnavailableException,
  BadRequestException,
  NotAcceptableException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordService } from './reset-password.service';

@Controller('/api/v1/auth')
@UseFilters(PrismaClientExceptionFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private mailService: MailService,
    private codeService: ResetPasswordService,
  ) {}

  @Post('/validate-code')
  @HttpCode(200)
  validateResetCode(@Body() dto: { code: string }) {
    if (!this.codeService.validateCode(dto.code)) {
      throw new NotAcceptableException('Code is not valid');
    }
  }

  @Post('/reset-password')
  @HttpCode(200)
  async resetPassword(@Body() dto: { email: string }) {
    const code = await this.codeService.generateCode(dto.email);
    return {
      code,
    };
  }

  @Post('/signup')
  signup(@Body() user: SignupUserDto) {
    return this.authService.signup(user);
  }

  @Post('/signin')
  async signin(@Body() user: SigninUserDto) {
    const { token } = await this.authService.signin(user.email, user.password);
    return { token };
  }

  @Post('/mail')
  async testMail(@Body() dto: { email: string; body: string }) {
    try {
      await this.mailService.sendMail({
        to: dto.email,
        subject: 'test streamly',
        html: dto.body,
      });
      return 'Mail sent!';
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException(e);
    }
  }
}
