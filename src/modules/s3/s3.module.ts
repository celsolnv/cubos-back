import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';

@Module({
  imports: [
    ConfigModule, // já deixa o ConfigService disponível
    // opcional: limites do multer (ajuste conforme precisar)
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
    }),
  ],
  controllers: [S3Controller],
  providers: [S3Service],
  exports: [S3Service], // exporta pra outros módulos se necessário
})
export class S3Module {}
