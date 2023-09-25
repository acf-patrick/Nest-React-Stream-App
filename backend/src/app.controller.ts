import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { readdirSync } from 'fs';
import { join } from 'path';

@Controller('/api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('list-videos')
  listVideos() {
    return readdirSync(join(__dirname, '..', 'public/datas/videos/'));
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
