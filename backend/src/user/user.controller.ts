import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from '../auth/guards/acces-token.guard';
import { ResetPasswordService } from '../auth/reset-password.service';
import { SetPasswordDto } from './dto/set-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('/api/v1/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private codeService: ResetPasswordService,
    private configService: ConfigService,
  ) {}

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  async updateUserDatas(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
    },
  ) {
    const picture = files.avatar?.at(0);
    await this.userService.updateUser(id, {
      ...dto,
      avatar: picture?.filename,
    });
    return 'User datas updated';
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getOne(id);
    if (user) {
      if (user.avatar) {
        user.avatar = `http://localhost:${this.configService.get<string>(
          'PORT',
        )}/datas/images/${user.avatar}`;
      }
      return user;
    }

    throw new NotFoundException(`No user found with ID ${id}`);
  }

  @Post('/password')
  async setPassword(@Body() dto: SetPasswordDto) {
    if (!this.codeService.validateCode(dto.code)) {
      throw new ForbiddenException('Invalid code provided.');
    }

    const email = this.codeService.getAssociatedEmail(dto.code);
    await this.userService.setPassword(email, dto.password);

    return 'Password successfully set';
  }
}
