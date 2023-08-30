import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { PostVideoDto } from './dto/post-video.dto';
import { createReadStream, statSync } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  async createVideo(video: PostVideoDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: video.userEmail },
      select: { id: true },
    });

    if (!user) {
      throw new UnauthorizedException('User non-existent');
    }

    return await this.prisma.video.create({
      data: {
        coverImage: video.coverImage,
        title: video.title,
        video: video.video,
        createdBy: {
          connect: {
            id: user.id,
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

  async getUsersVideos(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException(`No user with email ${email} found`);
    }

    return await this.prisma.video.findMany({
      where: {
        userId: user.id,
      },
    });
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
        const videoPath = join(process.cwd(), `./public/videos/${video}`);
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
      if (e instanceof NotFoundException) {
        throw e;
      } else {
        console.error(e);
        throw new ServiceUnavailableException();
      }
    }
  }

  async update(id: string, video: PostVideoDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: video.userEmail },
      select: { id: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const { userEmail, ...rest } = video;
    const record = {
      userId: user.id,
      ...rest,
    };

    return await this.prisma.video.upsert({
      where: { id },
      update: record,
      create: { id, ...record },
    });
  }

  async delete(id: string) {
    const video = await this.prisma.video.findUnique({ where: { id } });
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    [video.video, video.coverImage].forEach((path) => {
      fs.unlink(join(process.cwd(), `./public/videos/${path}`), (err) => {
        if (err) {
          console.error(err);
          throw new InternalServerErrorException(err);
        }
      });
    });

    await this.prisma.video.delete({ where: { id } });
  }
}
