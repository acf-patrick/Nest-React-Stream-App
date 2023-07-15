import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostVideoDto } from './dto/post-video.dto';
import { createReadStream, statSync } from 'fs';
import { join } from 'path';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  async createVideo(video: PostVideoDto) {
    return await this.prisma.video.create({
      data: {
        coverImage: video.coverImage,
        title: video.title,
        video: video.video,
        createdBy: {
          connect: {
            id: video.userId,
          },
        },
      },
    });
  }

  async readOneVideo(id: string) {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (video) {
      return video;
    }

    throw new NotFoundException(`No video with ID ${id}`);
  }

  async readVideos() {
    const videos = await this.prisma.video.findMany({
      include: { createdBy: true },
    });

    return videos;
  }

  async streamVideo(id: string, res: Response, req: Request) {
    try {
      const data = await this.prisma.video.findUnique({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException('Video not found');
      }

      const { range } = req.headers;
      if (range) {
        const { video } = data;
        const videoPath = join(process.cwd(), `./public/${video}`);
        const videoInfo = statSync(videoPath);
        const CHUNK_SIZE = 1e6; // 1Mb
        const start = Number(range.replace(/\D/g, ''));
        const end = Math.min(start + CHUNK_SIZE, videoInfo.size - 1);
        const videoLength = end - start + 1;
        res.status(HttpStatus.PARTIAL_CONTENT);
        res.header({
          'Content-Range': `bytes ${start}-${end}/${videoInfo.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': videoLength,
          'Content-Type': 'video/mp4',
        });

        const videoStream = createReadStream(videoPath, {
          start,
          end,
        });
        videoStream.pipe(res);
      } else {
        throw new BadRequestException('Range not found');
      }
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException();
    }
  }

  async update(id: string, video: PostVideoDto) {
    return await this.prisma.video.upsert({
      where: { id },
      update: { ...video },
      create: { id, ...video },
    });
  }

  async delete(id: string) {
    await this.prisma.video.delete({ where: { id } });
  }
}
