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
import { ResetPasswordService } from '../auth/reset-password.service';
import { ConfigService } from '@nestjs/config';

@Controller('/api/v1/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private codeService: ResetPasswordService,
    private configService: ConfigService,
  ) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getOne(id);
    if (user) {
      if (user.avatar) {
        user.avatar = `http://localhost:${this.configService.get<string>(
          'PORT',
        )}/${user.avatar}`;
      }
      return user;
    }

    throw new NotFoundException(`No user found with ID ${id}`);
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
