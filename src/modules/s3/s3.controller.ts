import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('upload')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const result = await this.s3Service.uploadImage(file, 'users/avatars');
    return { data: result };
  }

  @Get('image/:key/presign')
  async presign(@Param('key') key: string) {
    return { url: await this.s3Service.getPresignedUrl(key, 60 * 10) };
  }
}
