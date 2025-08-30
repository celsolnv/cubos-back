import { RepositoryListing } from 'src/types/modules/repository-listing-mode';
import { Movie } from '../entities/movie.entity';
import { ListAllMoviesDto } from '../dto/list-movies.dto';
import { ListedMovieDto } from '../dto/listed-movie.dto';

export abstract class AbstractMoviesRepository {
  abstract create(createMovieDto: Movie): Promise<Movie>;
  abstract findById(id: string): Promise<Movie | null>;
  abstract update(movie: Movie): Promise<Movie>;
  abstract remove(id: string): Promise<void>;
  abstract listAll(
    ListAllMovieDto: ListAllMoviesDto,
  ): Promise<RepositoryListing<ListedMovieDto>>;
  abstract findMoviesReleasingSoon(days: number): Promise<Movie[]>;
}
