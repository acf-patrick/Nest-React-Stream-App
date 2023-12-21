import {
  Controller,
  UploadedFiles,
  UseInterceptors,
  Res,
  Req,
  Body,
  Get,
  Put,
  Post,
  Delete,
  HttpCode,
  Param,
  Query,
  UseFilters,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  Redirect,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PostVideoDto } from './dto/post-video.dto';
import { PrismaClientExceptionFilter } from '../prisma-client-exception/prisma-client-exception.filter';
import { AccessTokenGuard } from '../auth/guards/acces-token.guard';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from '../firebase/firebase.service';
import { readFileSync } from 'fs';

@Controller('video')
@UseFilters(PrismaClientExceptionFilter)
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private prisma: PrismaService,
    private firebase: FirebaseService,
  ) {}

  @Get('/cover/:filename')
  @Redirect()
  async getCoverFile(@Param('filename') filename: string) {
    return {
      url: await this.firebase.getUrl(`datas/videos/${filename}`),
    };
  }

  @Get('/a')
  @UseGuards(AccessTokenGuard)
  async readVideos(@Query('user') userId?: string) {
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          email: true,
        },
      });

      if (!user) {
        throw new BadRequestException(`No user with ID ${userId}`);
      }

      const videos = await this.videoService.getUsersVideos(user['email']);
      if (!videos) {
        throw new NotFoundException('No video found for this user');
      }

      return videos.map((record) => {
        const { video, ...datas } = record;
        return datas;
      });
    }

    const videos = await this.videoService.readVideos();
    if (!videos) {
      throw new NotFoundException('No video found');
    }

    return videos.map((record) => {
      const { video, ...datas } = record;
      return datas;
    });
  }

  @Get('/:id')
  stream(@Param('id') id: string, @Res() res, @Req() req) {
    return this.videoService.streamVideo(id, res, req);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async readUserVideo(@Req() req: Request, @Query('id') id: string) {
    if (id) {
      const record = await this.videoService.readOneVideo(id);
      if (!record) {
        throw new NotFoundException('Video non-existent.');
      }

      const { video, ...datas } = record;
      return datas;
    }

    // return user's videos
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    const videos = await this.videoService.getUsersVideos(user['email']);
    if (!videos) {
      throw new NotFoundException('No video found for this user');
    }

    return videos.map((record) => {
      const { video, ...datas } = record;
      return datas;
    });
  }

  @Put('/:id')
  @UseGuards(AccessTokenGuard)
  update(@Param('id') id: string, @Body() video: PostVideoDto) {
    return this.videoService.update(id, video);
  }

  @Delete('/:id')
  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  async delete(@Req() req: Request, @Param('id') id: string) {
    const email = req.user!['email'];
    return this.videoService.delete(id, email);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  async postVideo(
    @Req() req: Request,
    @Body()
    video: {
      title: string;
    },
    @UploadedFiles()
    files: {
      video?: Express.Multer.File[];
      cover?: Express.Multer.File[];
    },
  ) {
    if (!files.video || !files.cover) {
      throw new BadRequestException('No video or cover image provided');
    }

    if (!req.user) {
      throw new UnauthorizedException();
    }

    const payload = {
      title: video.title,
      video: files.video[0].filename,
      coverImage: files.cover[0].filename,
      userEmail: req.user['email'],
    };

    {
      // Upload files

      const video = readFileSync(files.video[0].path);
      await this.firebase.upload(
        video,
        `datas/videos/${files.video[0].filename}`,
      );

      const cover = readFileSync(files.cover[0].path);
      await this.firebase.upload(
        cover,
        `datas/videos/${files.cover[0].filename}`,
      );
    }

    return this.videoService.createVideo(payload);
  }
}
