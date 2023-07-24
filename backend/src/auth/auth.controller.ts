import {
  Controller,
  HttpCode,
  Post,
  Body,
  UseFilters,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';
import { MailService } from 'src/mail/mail.service';

@Controller('/api/v1/auth')
@UseFilters(PrismaClientExceptionFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private mailService: MailService,
  ) {}

  @Post('/signup')
  @HttpCode(201)
  signup(@Body() user: SignupUserDto) {
    return this.authService.signup(user);
  }

  @Post('/signin')
  async signin(@Body() user: SigninUserDto) {
    const { token } = await this.authService.signin(user.email, user.password);
    return { token };
  }

  @Post('/mail')
  async testMail(@Body() user: { email: string }) {
    try {
      await this.mailService.sendMail({
        to: user.email,
        subject: 'test streamly',
        text: 'hello world',
        html: '<b>Hello world<b>',
      });
      return 'Mail sent!';
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException(e);
    }
  }
}
