import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ListAllMoviesDto } from './dto/list-movies.dto';
import PaginationWrapper from 'src/utils/pagination/pagination-wrapper';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/lib/swagger/paginated-response';
import { Request } from 'express';
import { ListedMovieDto } from './dto/listed-movie.dto';
import { MovieDetailDto } from './dto/movie-detail.dto';
import { MovieStatsDto } from './dto/movie-stats.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('movies')
@Controller('movies')
@ApiBearerAuth()
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @ApiOperation({
    summary: 'Criar um novo filme',
    description:
      'Cria um novo registro de filme com todas as informações fornecidas',
  })
  @ApiBody({
    type: CreateMovieDto,
    description: 'Dados do filme a ser criado',
  })
  @ApiCreatedResponse({
    description: 'Filme criado com sucesso',
    type: MovieDetailDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos fornecidos',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado',
  })
  @ApiForbiddenResponse({
    description: 'Usuário sem permissão para criar filmes',
  })
  @Post()
  @UseInterceptors(FileInterceptor('banner'))
  create(
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile() banner?: Express.Multer.File,
  ) {
    return this.movieService.create(createMovieDto, banner);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os filmes',
    description: 'Retorna uma lista paginada de filmes com opções de filtro',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filtrar por nome do filme',
    example: 'Vingadores',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por status do filme',
    example: 'lançado',
  })
  @ApiQuery({
    name: 'genre',
    required: false,
    description: 'Filtrar por gênero',
    example: 'Ação',
  })
  @ApiQuery({
    name: 'director',
    required: false,
    description: 'Filtrar por diretor',
    example: 'Christopher Nolan',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Filtrar por ano de lançamento',
    example: 2019,
  })
  @ApiQuery({
    name: 'minRating',
    required: false,
    description: 'Filtrar por avaliação mínima',
    example: 7.0,
  })
  @ApiQuery({
    name: 'maxRating',
    required: false,
    description: 'Filtrar por avaliação máxima',
    example: 9.0,
  })
  @ApiQuery({
    name: 'minDuration',
    required: false,
    description: 'Filtrar por duração mínima em minutos',
    example: 120,
  })
  @ApiQuery({
    name: 'maxDuration',
    required: false,
    description: 'Filtrar por duração máxima em minutos',
    example: 180,
  })
  @ApiPaginatedResponse(ListedMovieDto)
  @ApiOkResponse({
    description: 'Lista de filmes retornada com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Parâmetros de filtro inválidos',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado',
  })
  async findAll(@Req() req: Request, @Query() params: ListAllMoviesDto) {
    const data = await this.movieService.listAll(params);

    return PaginationWrapper({
      data,
      page: params.page,
      limit: params.limit,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar filme por ID',
    description: 'Retorna os detalhes completos de um filme específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do filme',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Filme encontrado com sucesso',
    type: MovieDetailDto,
  })
  @ApiNotFoundResponse({
    description: 'Filme não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'ID inválido fornecido',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado',
  })
  findOne(@Param('id') id: string) {
    return this.movieService.findById({ id });
  }

  @ApiOperation({
    summary: 'Atualizar filme',
    description: 'Atualiza as informações de um filme existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do filme a ser atualizado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateMovieDto,
    description: 'Dados atualizados do filme',
  })
  @ApiOkResponse({
    description: 'Filme atualizado com sucesso',
    type: MovieDetailDto,
  })
  @ApiNotFoundResponse({
    description: 'Filme não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos fornecidos',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado',
  })
  @ApiForbiddenResponse({
    description: 'Usuário sem permissão para atualizar filmes',
  })
  @Put(':id')
  @UseInterceptors(FileInterceptor('banner'))
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @UploadedFile() banner?: Express.Multer.File,
  ) {
    console.log(banner);
    return this.movieService.update(id, updateMovieDto, banner);
  }

  @HttpCode(204)
  @Delete(':id')
  @ApiOperation({
    summary: 'Excluir filme',
    description: 'Remove um filme da base de dados (soft delete)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do filme a ser excluído',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNoContentResponse({
    description: 'Filme excluído com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Filme não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'ID inválido fornecido',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado',
  })
  @ApiForbiddenResponse({
    description: 'Usuário sem permissão para excluir filmes',
  })
  remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }
}
