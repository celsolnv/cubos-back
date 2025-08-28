import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  IsArray,
  Length,
  Min,
  Max,
  IsUrl,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MovieStatus, MovieGenre } from '../constants';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Nome do filme',
    example: 'Vingadores: Ultimato',
    minLength: 3,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;

  @ApiPropertyOptional({
    description: 'Nome original do filme',
    example: 'Avengers: Endgame',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  originalName?: string;

  @ApiPropertyOptional({
    description: 'Descrição do filme',
    example:
      'Após os eventos devastadores de "Vingadores: Guerra Infinita", o universo está em ruínas...',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Status do filme',
    example: MovieStatus.RELEASED,
    default: MovieStatus.RELEASED,
    enum: MovieStatus,
  })
  @IsOptional()
  @IsEnum(MovieStatus)
  status?: MovieStatus;

  @ApiPropertyOptional({
    description: 'Data de lançamento do filme',
    example: '2019-04-26',
  })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @ApiPropertyOptional({
    description: 'Orçamento do filme em dólares',
    example: 356000000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @ApiPropertyOptional({
    description: 'Receita do filme em dólares',
    example: 2797800564,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  revenue?: number;

  @ApiPropertyOptional({
    description: 'URL do banner/poster do filme',
    example: 'https://example.com/banner.jpg',
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl()
  @Length(0, 500)
  banner?: string;

  @ApiPropertyOptional({
    description: 'Gêneros do filme',
    example: [MovieGenre.ACTION, MovieGenre.ADVENTURE, MovieGenre.DRAMA],
    enum: MovieGenre,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(MovieGenre, { each: true })
  genres?: MovieGenre[];

  @ApiPropertyOptional({
    description: 'Diretor do filme',
    example: 'Anthony Russo, Joe Russo',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  director?: string;

  @ApiPropertyOptional({
    description: 'Duração do filme em minutos',
    example: 181,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  durationMinutes?: number;

  @ApiPropertyOptional({
    description: 'Avaliação do filme (0.0 a 10.0)',
    example: 8.4,
    minimum: 0.0,
    maximum: 10.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.0)
  @Max(10.0)
  rating?: number;
}
