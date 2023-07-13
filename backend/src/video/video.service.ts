import { Injectable, NotFoundException } from '@nestjs/common';
import { Video } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostVideoDto } from './dto/post-video.dto';

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

  async readVideo(id: string) {
    const video = await this.prisma.video.findUnique({
      where: {
        id,
      },
    });

    if (video) {
      return video;
    }

    throw new NotFoundException(`Video with ID ${id} not found`);
  }
}
