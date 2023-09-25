import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';

@Module({
  controllers: [VideoController],
  providers: [VideoService],
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../', 'public/datas/videos'),
        filename: (_, file, callback) => {
          const ext = file.mimetype.split('/')[1];
          callback(null, `${uuidv4()}-${Date.now()}.${ext}`);
        },
      }),
    }),
  ],
})
export class VideoModule {}
