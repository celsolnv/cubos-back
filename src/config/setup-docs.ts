import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';

export function setupSwaggerDocs(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API de Filmes - Cubos Academy')
    .setDescription(
      'API completa para gerenciamento de filmes com funcionalidades de CRUD, filtros avançados e estatísticas',
    )
    .setVersion('1.0')
    .addTag('movies', 'Endpoints para gerenciamento de filmes')
    .addTag('auth', 'Endpoints para autenticação')
    .addTag('users', 'Endpoints para gerenciamento de usuários')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();

  const swaggerOptions: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
  };

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions,
  );

  SwaggerModule.setup('docs', app, document);
}
