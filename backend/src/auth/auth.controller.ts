import { Controller, HttpCode, Post, Body, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';

@Controller('/api/v1/auth')
@UseFilters(PrismaClientExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
