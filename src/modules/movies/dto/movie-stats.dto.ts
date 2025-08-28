import { ApiProperty } from '@nestjs/swagger';
import { MovieGenre } from '../constants';

export class MovieStatsDto {
  @ApiProperty({
    description: 'Número total de filmes',
    example: 1000,
  })
  totalMovies: number;

  @ApiProperty({
    description: 'Número de filmes lançados',
    example: 850,
  })
  releasedMovies: number;

  @ApiProperty({
    description: 'Número de filmes em produção',
    example: 150,
  })
  inProductionMovies: number;

  @ApiProperty({
    description: 'Filme com maior orçamento',
    example: {
      name: 'Avatar 2',
      budget: 350000000,
    },
  })
  highestBudgetMovie: {
    name: string;
    budget: number;
  };

  @ApiProperty({
    description: 'Filme com maior receita',
    example: {
      name: 'Avatar',
      revenue: 2847246203,
    },
  })
  highestRevenueMovie: {
    name: string;
    revenue: number;
  };

  @ApiProperty({
    description: 'Filme com melhor avaliação',
    example: {
      name: 'Um Sonho de Liberdade',
      rating: 9.3,
    },
  })
  highestRatedMovie: {
    name: string;
    rating: number;
  };

  @ApiProperty({
    description: 'Filme mais longo',
    example: {
      name: 'Guerra e Paz',
      duration: 431,
    },
  })
  longestMovie: {
    name: string;
    duration: number;
  };

  @ApiProperty({
    description: 'Gêneros mais populares',
    example: [
      { genre: MovieGenre.ACTION, count: 250 },
      { genre: MovieGenre.DRAMA, count: 200 },
      { genre: MovieGenre.COMEDY, count: 180 },
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        genre: { type: 'string' },
        count: { type: 'number' },
      },
    },
  })
  popularGenres: Array<{
    genre: MovieGenre;
    count: number;
  }>;

  @ApiProperty({
    description: 'Diretores mais prolíficos',
    example: [
      { director: 'Steven Spielberg', count: 35 },
      { director: 'Martin Scorsese', count: 25 },
      { director: 'Christopher Nolan', count: 12 },
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        director: { type: 'string' },
        count: { type: 'number' },
      },
    },
  })
  prolificDirectors: Array<{
    director: string;
    count: number;
  }>;

  @ApiProperty({
    description: 'Avaliação média geral',
    example: 7.2,
  })
  averageRating: number;

  @ApiProperty({
    description: 'Duração média em minutos',
    example: 115,
  })
  averageDuration: number;
}
