import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [VideoController],
  providers: [VideoService],
  imports: [PrismaModule]
})
export class VideoModule {}
