import {
  Get,
  Param,
  NotFoundException,
  Controller,
  Body,
  Post,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResetPasswordService } from 'src/auth/reset-password.service';

@Controller('/api/v1/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private codeService: ResetPasswordService,
  ) {}

  @Get(':email')
  async getOneUser(@Param() email: string) {
    const user = await this.userService.getOne(email);
    if (user) {
      return user;
    }
    throw new NotFoundException(`Not user found with email ${email}`);
  }

  @Post('/password')
  async setPassword(@Body() dto: { code: string; password: string }) {
    if (!this.codeService.validateCode(dto.code)) {
      throw new ForbiddenException('Invalid code provided.');
    }

    const email = this.codeService.getAssociatedEmail(dto.code);
    await this.userService.setPassword(email, dto.password);

    return 'Password successfully set';
  }
}
