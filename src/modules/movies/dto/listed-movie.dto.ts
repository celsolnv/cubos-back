import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MovieStatus, MovieGenre } from '../constants';

export class ListedMovieDto {
  @ApiProperty({
    description: 'ID único do filme',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do filme',
    example: 'Vingadores: Ultimato',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Nome original do filme',
    example: 'Avengers: Endgame',
  })
  originalName?: string;

  @ApiPropertyOptional({
    description: 'Descrição do filme',
    example: 'Após os eventos devastadores de "Vingadores: Guerra Infinita"...',
  })
  description?: string;

  @ApiProperty({
    description: 'Status do filme',
    example: MovieStatus.RELEASED,
    enum: MovieStatus,
  })
  status: MovieStatus;

  @ApiPropertyOptional({
    description: 'Data de lançamento do filme',
    example: '2019-04-26',
  })
  releaseDate?: string;

  @ApiPropertyOptional({
    description: 'Orçamento do filme em dólares',
    example: 356000000,
  })
  budget?: number;

  @ApiPropertyOptional({
    description: 'Receita do filme em dólares',
    example: 2797800564,
  })
  revenue?: number;

  @ApiPropertyOptional({
    description: 'URL do banner/poster do filme',
    example: 'https://example.com/banner.jpg',
  })
  bannerUrl?: string;

  @ApiPropertyOptional({
    description: 'Chave do banner/poster do filme',
    example: 'banner.jpg',
  })
  bannerKey?: string;

  @ApiPropertyOptional({
    description: 'Data de expiração do banner/poster do filme',
    example: '2024-01-01T00:00:00.000Z',
  })
  bannerExpiresAt?: Date;

  @ApiPropertyOptional({
    description: 'Gêneros do filme',
    example: [MovieGenre.ACTION, MovieGenre.ADVENTURE, MovieGenre.DRAMA],
    enum: MovieGenre,
    isArray: true,
  })
  genres?: MovieGenre[];

  @ApiPropertyOptional({
    description: 'Diretor do filme',
    example: 'Anthony Russo, Joe Russo',
  })
  director?: string;

  @ApiPropertyOptional({
    description: 'Duração do filme em minutos',
    example: 181,
  })
  durationMinutes?: number;

  @ApiPropertyOptional({
    description: 'Avaliação do filme (0.0 a 10.0)',
    example: 8.4,
  })
  rating?: number;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Data de última atualização do registro',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: string;
}
