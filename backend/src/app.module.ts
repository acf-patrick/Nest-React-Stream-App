import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { VideoModule } from './video/video.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: [join(__dirname, '..', 'public/datas/videos')],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    VideoModule,
    UserModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
