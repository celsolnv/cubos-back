import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/utils/pagination/dto/pagination.dto';
import { MovieStatus, MovieGenre } from '../constants';
import { Transform, Type } from 'class-transformer';

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
    description: 'Filtrar por gêneros',
    example: [MovieGenre.ACTION, MovieGenre.ADVENTURE],
    enum: MovieGenre,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(MovieGenre, { each: true })
  @Type(() => String)
  genres?: MovieGenre[];

  @ApiPropertyOptional({
    description: 'Filtrar por diretor',
    example: 'Christopher Nolan',
  })
  @IsOptional()
  @IsString()
  director?: string;

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
  @Transform(({ value }) => parseInt(value))
  min_duration?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por duração máxima em minutos',
    example: 180,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  max_duration?: number;

  @ApiPropertyOptional({
    description:
      'Data inicial para filtrar por data de lançamento (ISO date string)',
    example: '2019-01-01',
  })
  @IsOptional()
  @IsDateString()
  initial_date?: string;

  @ApiPropertyOptional({
    description:
      'Data final para filtrar por data de lançamento (ISO date string)',
    example: '2019-12-31',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
