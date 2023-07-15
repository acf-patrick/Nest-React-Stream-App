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
} from '@nestjs/common';
import { VideoService } from './video.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PostVideoDto } from './dto/post-video.dto';

@Controller('/api/v1/video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  readVideos() {
    return this.videoService.readVideos();
  }

  @Get()
  readOneVideo(@Query() id: string) {
    return this.videoService.readOneVideo(id);
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
  delete(@Param('id') id: string) {
    return this.videoService.delete(id);
  }

  @Post()
  @HttpCode(201)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  createBook(
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
    return this.videoService.createVideo(payload);
  }
}
