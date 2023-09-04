import { Request } from 'express';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Video } from '@prisma/client';
import { PostVideoDto } from './dto/post-video.dto';

describe('VideoController', () => {
  let controller: VideoController;
  let videoService: DeepMockProxy<VideoService>;

  beforeAll(async () => {
    videoService = mockDeep<VideoService>();
    controller = new VideoController(videoService as unknown as VideoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns all video records', async () => {
    videoService.readVideos.mockResolvedValue([]);
    await expect(controller.readVideos()).resolves.toEqual([]);
  });

  it('returns one video', async () => {
    const record: Video = {
      coverImage: 'image_file',
      id: 'video_id',
      title: 'video_title',
      uploadDate: new Date(),
      userId: 'user_id',
      video: 'file_name',
    };
    videoService.readOneVideo.mockResolvedValue(record);

    const { video, ...datas } = record;
    await expect(controller.readOneVideo(record.id)).resolves.toStrictEqual(
      datas,
    );
  });

  it('should update one video record', async () => {
    const record: Video = {
      coverImage: 'image_file',
      id: 'video_id',
      title: 'video_title',
      uploadDate: new Date(),
      userId: 'user_id',
      video: 'file_name',
    };
    videoService.update.mockImplementation(
      async (id: string, video: PostVideoDto) => {
        return {
          ...record,
          ...video,
        };
      },
    );

    const dto: PostVideoDto = {
      coverImage: 'new_cover_image',
      title: 'new_video_title',
      userEmail: 'new_user@mail.com',
      video: 'new_video_file',
    };
    await expect(controller.update(record.id, dto)).resolves.toStrictEqual({
      ...record,
      ...dto,
    });
  });

  it('should not throw error on video deletion', async () => {
    videoService.delete.mockImplementation(async (id: string) => {});

    const req = {
      user: {
        email: 'user@mail.com',
      },
    } as unknown as Request;

    await expect(controller.delete(req, 'video_id')).resolves.not.toThrow();
  });
});
