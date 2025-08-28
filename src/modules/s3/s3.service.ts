import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { environmentVariables } from '@/config/environment-variables';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export type UploadResult = {
  key: string;
  url: string;
  size: number;
  contentType?: string;
};

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private s3: S3Client;
  private bucketName: string;
  private region: string;
  private readonly urlPrefix: string;

  constructor() {
    this.s3 = new S3Client({
      region: environmentVariables.AWS_REGION,
      credentials: {
        accessKeyId: environmentVariables.AWS_ACCESS_KEY_ID,
        secretAccessKey: environmentVariables.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.bucketName = environmentVariables.AWS_S3_BUCKET;
    this.region = environmentVariables.AWS_REGION;
    this.urlPrefix = `https://${this.bucketName}.s3.${this.region}.amazonaws.com`;
  }

  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadResult> {
    if (!file || !file.buffer) {
      throw new HttpException(
        'Arquivo inválido ou vazio',
        HttpStatus.BAD_REQUEST,
      );
    }

    const extName = file.originalname
      ? `-${file.originalname.replace(/\s+/g, '_')}`
      : '';
    const key = `${folder ? `${folder.replace(/\/+$/, '')}/` : ''}${randomUUID()}${extName}`;

    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size,
    };

    try {
      await this.s3.send(new PutObjectCommand(params));

      return {
        key,
        url: `${this.urlPrefix}/${encodeURIComponent(key)}`,
        size: file.size,
        contentType: file.mimetype,
      };
    } catch (error) {
      this.logger.error('Erro upload S3', error as any);
      throw new HttpException(
        'Erro ao enviar arquivo para S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Gera uma URL assinada para download (GET) do objeto.
   * expiresIn em segundos (padrão 3600 = 1h).
   */
  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    if (!key) {
      throw new HttpException('Key é obrigatória', HttpStatus.BAD_REQUEST);
    }

    try {
      const cmd = new GetObjectCommand({ Bucket: this.bucketName, Key: key });
      return await getSignedUrl(this.s3, cmd, { expiresIn });
    } catch (error) {
      this.logger.error('Erro gerando presigned URL', error as any);
      throw new HttpException(
        'Erro ao gerar URL assinada',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteObject(key: string): Promise<void> {
    if (!key) {
      throw new HttpException('Key é obrigatória', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.s3.send(
        new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }),
      );
    } catch (error) {
      this.logger.error('Erro ao deletar objeto S3', error as any);
      throw new HttpException(
        'Erro ao deletar arquivo do S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
