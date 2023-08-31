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
} from '@nestjs/common';
import { VideoService } from './video.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PostVideoDto } from './dto/post-video.dto';
import { PrismaClientExceptionFilter } from '../prisma-client-exception/prisma-client-exception.filter';
import { AccesTokenGuard } from '../auth/guards/acces-token.guard';
import { Request } from 'express';

@Controller('/api/v1/video')
@UseGuards(AccesTokenGuard)
@UseFilters(PrismaClientExceptionFilter)
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  async readUsersVideos(@Req() req: Request) {
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

  @Get('/a')
  async readVideos() {
    const videos = await this.videoService.readVideos();
    if (!videos) {
      throw new NotFoundException('No video found');
    }

    return videos.map((record) => {
      const { video, ...datas } = record;
      return datas;
    });
  }

  @Get()
  async readOneVideo(@Query('id') id: string) {
    const record = await this.videoService.readOneVideo(id);
    if (!record) {
      throw new NotFoundException('Video non-existent.');
    }

    const { video, ...datas } = record;
    return datas;
  }

  @Get('/:id')
  stream(@Param('id') id: string, @Res() res, @Req() req) {
    return this.videoService.streamVideo(id, res, req);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() video: PostVideoDto) {
    return this.videoService.update(id, video);
  }

  @Delete('/:id')
  @HttpCode(200)
  async delete(@Req() req: Request, @Param('id') id: string) {
    const email = req.user!['email'];
    return this.videoService.delete(id, email);
  }

  @Post()
  @HttpCode(201)
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
    return this.videoService.createVideo(payload);
  }
}
