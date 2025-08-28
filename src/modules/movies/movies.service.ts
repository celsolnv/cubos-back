import { HttpStatus, Injectable } from '@nestjs/common';
import AppException from 'src/exception-filters/app-exception/app-exception';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AbstractMoviesRepository } from './repositories/abstract.movies.repository';
import { Movie } from './entities/movie.entity';
import { ListAllMoviesDto } from './dto/list-movies.dto';
import {
  FindServiceMode,
  FindServiceResult,
} from 'src/types/modules/find-service-mode';

@Injectable()
export class MoviesService {
  constructor(private movieRepository: AbstractMoviesRepository) {}

  async create(createMovieDto: CreateMovieDto) {
    const movie = new Movie();
    movie.fromDto(createMovieDto);

    const createdMovie = await this.movieRepository.create(movie);
    return createdMovie;
  }

  listAll(params: ListAllMoviesDto) {
    return this.movieRepository.listAll(params);
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.findById({ id, mode: 'ensureExistence' });

    movie.fromDto(updateMovieDto);
    return await this.movieRepository.update(movie);
  }

  async remove(id: string) {
    await this.findById({
      id,
      mode: 'ensureExistence',
    });

    await this.movieRepository.remove(id);
  }

  async findById<Mode extends FindServiceMode>(params: {
    id: string;
    mode?: Mode;
  }) {
    const { id, mode = 'default' } = params;
    const existingMovie = await this.movieRepository.findById(id);

    if (!existingMovie && mode === 'ensureExistence') {
      throw new AppException(`Filmes não encontrado(a)`, HttpStatus.NOT_FOUND);
    }

    if (existingMovie && mode === 'ensureNonExistence') {
      throw new AppException(
        `Existe outro(a) Filmes com este id`,
        HttpStatus.CONFLICT,
      );
    }

    return existingMovie as FindServiceResult<Movie, Mode>;
  }

  async getStats() {
    // TODO: Implementar lógica para buscar estatísticas dos filmes
    // Por enquanto retorna dados mockados
    return {
      totalMovies: 0,
      releasedMovies: 0,
      inProductionMovies: 0,
      highestBudgetMovie: { name: '', budget: 0 },
      highestRevenueMovie: { name: '', revenue: 0 },
      highestRatedMovie: { name: '', rating: 0 },
      longestMovie: { name: '', duration: 0 },
      popularGenres: [],
      prolificDirectors: [],
      averageRating: 0,
      averageDuration: 0,
    };
  }
}
