import {
  Controller,
  HttpCode,
  Post,
  Body,
  UseFilters,
  ServiceUnavailableException,
  BadRequestException,
  NotAcceptableException,
  InternalServerErrorException,
  Get,
  Req,
  Query,
  Param,
  Ip,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordService } from './reset-password.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('/api/v1/auth')
@UseFilters(PrismaClientExceptionFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private mailService: MailService,
    private codeService: ResetPasswordService,
    private prisma: PrismaService,
  ) {}

  @Post('/validate-code')
  @HttpCode(200)
  validateResetCode(@Body() dto: { code: string }) {
    if (!this.codeService.validateCode(dto.code)) {
      throw new NotAcceptableException('Invalid code');
    }
    return 'ok';
  }

  @Post('/reset-password')
  @HttpCode(200)
  async resetPassword(@Body() dto: { email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) {
      const { code } = await this.codeService.generateCode(dto.email);
      try {
        await this.mailService.sendMail({
          to: dto.email,
          subject: 'Reset password',
          html: `You can reset your password using this code : <b>${code}</b>`,
        });
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
      return 'Check your mailbox';
    }

    throw new BadRequestException(`Invalid email`);
  }

  @Post('/signup')
  signup(@Body() user: SignupUserDto) {
    return this.authService.signup(user);
  }

  @Post('/signin')
  async signin(
    @Req() req: Request,
    @Body() dto: SigninUserDto,
    @Ip() ip: string,
  ) {
    const user = await this.authService.signin(dto.email, dto.password);

    const userAgent = req.headers['user-agent'];
    const refreshToken = this.authService.generateRefreshToken(
      dto.email,
      ip,
      userAgent,
    );

    return {
      ...user,
      refreshToken,
    };
  }

  @Get('/refresh/:refresh-token')
  async refreshToken(
    @Req() req: Request & { userId: string },
    @Param('refresh-token') refreshtToken: string,
  ) {
    return 'ok';
  }
}
