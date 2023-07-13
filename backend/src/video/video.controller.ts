import {
  Controller,
  UploadedFiles,
  UseInterceptors,
  Req,
  Body,
  Post,
  HttpCode,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('/api/v1/video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  async createBook(
    @Req() req: Request & { userId: string },
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
    const payload = {
      userId: req.userId,
      title: video.title,
      video: files.video[0].filename,
      coverImage: files.cover[0].filename,
    };
    return await this.videoService.createVideo(payload);
  }
}
