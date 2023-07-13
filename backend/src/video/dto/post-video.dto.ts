import { IsString, IsUUID } from 'class-validator';

export class PostVideoDto {
  @IsString()
  title: string;

  @IsString()
  video: string;

  @IsString()
  coverImage: string;

  @IsUUID()
  userId: string;
}
