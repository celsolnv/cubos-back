import { ApiProperty } from '@nestjs/swagger';
import { ListedMovieDto } from './listed-movie.dto';

export class PaginatedMovieDto {
  @ApiProperty({
    description: 'Lista de filmes',
    type: [ListedMovieDto],
  })
  data: ListedMovieDto[];

  @ApiProperty({
    description: 'Número total de filmes',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Número de itens por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Número total de páginas',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Indica se há uma página anterior',
    example: false,
  })
  hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Indica se há uma próxima página',
    example: true,
  })
  hasNextPage: boolean;
}
