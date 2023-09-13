import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    PrismaModule,
    AuthModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './public/images',
        filename: (_, file, callback) => {
          const ext = file.mimetype.split('/')[1];
          callback(null, `${uuidv4()}.${ext}`);
        },
      }),
    }),
  ],
  exports: [UserService],
})
export class UserModule {}
