import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { S3Service } from './s3.service';

@ApiTags('upload')
@Controller('upload')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Fazer upload de imagem',
    description: 'Faz upload de uma imagem para o S3 na pasta users/avatars',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem para upload',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Imagem enviada com sucesso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            key: { type: 'string', example: 'users/avatars/abc123.jpg' },
            url: {
              type: 'string',
              example:
                'https://bucket.s3.amazonaws.com/users/avatars/abc123.jpg',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Arquivo inválido ou não fornecido',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async upload(@UploadedFile() file: Express.Multer.File) {
    const result = await this.s3Service.uploadImage(file, 'users/avatars');
    return { data: result };
  }

  @Get('image/presign')
  @ApiOperation({
    summary: 'Gerar URL pré-assinada',
    description: 'Gera uma URL pré-assinada para acessar uma imagem do S3',
  })
  @ApiParam({
    name: 'key',
    description: 'Chave da imagem no S3',
    example: 'users/avatars/abc123.jpg',
  })
  @ApiResponse({
    status: 200,
    description: 'URL pré-assinada gerada com sucesso',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example:
            'https://bucket.s3.amazonaws.com/users/avatars/abc123.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Chave inválida fornecida',
  })
  @ApiResponse({
    status: 404,
    description: 'Imagem não encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async presign(@Query('key') key: string) {
    return { url: await this.s3Service.getPresignedUrl(key) };
  }
}
