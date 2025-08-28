import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/utils/pagination/dto/pagination.dto';
import { MovieStatus, MovieGenre } from '../constants';

export class ListAllMoviesDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por nome do filme',
    example: 'Vingadores',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por status do filme',
    example: MovieStatus.RELEASED,
    enum: MovieStatus,
  })
  @IsOptional()
  @IsEnum(MovieStatus)
  status?: MovieStatus;

  @ApiPropertyOptional({
    description: 'Filtrar por gênero',
    example: MovieGenre.ACTION,
    enum: MovieGenre,
  })
  @IsOptional()
  @IsEnum(MovieGenre)
  genre?: MovieGenre;

  @ApiPropertyOptional({
    description: 'Filtrar por diretor',
    example: 'Christopher Nolan',
  })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ano de lançamento',
    example: 2019,
  })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  year?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por avaliação mínima',
    example: 7.0,
    minimum: 0.0,
    maximum: 10.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.0)
  @Max(10.0)
  minRating?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por avaliação máxima',
    example: 9.0,
    minimum: 0.0,
    maximum: 10.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.0)
  @Max(10.0)
  maxRating?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por duração mínima em minutos',
    example: 120,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minDuration?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por duração máxima em minutos',
    example: 180,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxDuration?: number;
}
