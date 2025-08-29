// src/movies/dto/create-movie.dto.ts
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
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
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
  @MaxLength(255)
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
    description: 'Data de lançamento do filme (ISO date string)',
    example: '2019-04-26',
  })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @ApiPropertyOptional({
    description: 'Orçamento do filme em dólares',
    example: 356000000,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'budget must be a number' })
  @Min(0)
  budget?: number;

  @ApiPropertyOptional({
    description: 'Receita do filme em dólares',
    example: 2797800564,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'revenue must be a number' })
  @Min(0)
  revenue?: number;

  @ApiPropertyOptional({
    description: 'URL do banner/poster do filme',
    example: 'https://example.com/banner.jpg',
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  bannerUrl?: string;

  @ApiPropertyOptional({
    description: 'Gêneros do filme (array ou CSV string: "ACTION,DRAMA")',
    example: [MovieGenre.ACTION, MovieGenre.ADVENTURE, MovieGenre.DRAMA],
    enum: MovieGenre,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value && value !== 0) return undefined;
    // Se já for array (ex.: múltiplos campos form-data), retorna como está
    if (Array.isArray(value)) return value;
    // Se for string CSV, separa por vírgula
    if (typeof value === 'string') {
      // aceita tanto "A,B" quanto '["A","B"]'
      try {
        if (value.trim().startsWith('[')) {
          return JSON.parse(value);
        }
        // eslint-disable-next-line no-empty
      } catch {}
      return value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return value;
  })
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
  @MaxLength(255)
  director?: string;

  @ApiPropertyOptional({
    description: 'Duração do filme em minutos',
    example: 181,
    minimum: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'durationMinutes must be a number' })
  @Min(1)
  durationMinutes?: number;

  @ApiPropertyOptional({
    description: 'Avaliação do filme (0.0 a 10.0)',
    example: 8.4,
    minimum: 0.0,
    maximum: 10.0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'rating must be a number' })
  @Min(0.0)
  @Max(10.0)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Idioma do filme',
    example: 'pt-BR',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  language?: string;

  @ApiPropertyOptional({
    description: 'Popularidade do filme',
    example: 1000,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'popularity must be a number' })
  @Min(0)
  popularity?: number;

  @ApiPropertyOptional({
    description: 'Número de votos do filme',
    example: 50000,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'votes must be a number' })
  @Min(0)
  votes?: number;

  @ApiPropertyOptional({
    description: 'Tagline do filme',
    example: 'Uma tagline inspiradora',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  tagline?: string;
}
