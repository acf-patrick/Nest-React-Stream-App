import { Controller, HttpCode, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(201)
  async signup(@Body() user: SignupUserDto) {
    return await this.authService.signup(user);
  }

  @Post('/signin')
  async signin(@Body() user: SignupUserDto) {
    const { token } = await this.authService.signin(user.email, user.password);
    return token;
  }
}
