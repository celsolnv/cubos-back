import { Injectable } from '@nestjs/common';
import { Repository, EntityManager, DataSource, Between } from 'typeorm';
import { Movie } from '../../entities/movie.entity';
import { AbstractMoviesRepository } from '../abstract.movies.repository';
import { ListAllMoviesDto } from '../../dto/list-movies.dto';
import { ListedMovieDto } from '../../dto/listed-movie.dto';
import { RepositoryListing } from 'src/types/modules/repository-listing-mode';
import * as moment from 'moment';

@Injectable()
export class MoviesTypeormRepository extends AbstractMoviesRepository {
  private moviesRepository: Repository<Movie>;
  private entityManager: EntityManager;

  constructor(dataSource: DataSource) {
    super();

    this.entityManager = dataSource.createEntityManager();
    this.moviesRepository = this.entityManager.getRepository(Movie);
  }

  public async create(movie: Movie) {
    return await this.moviesRepository.save(movie);
  }

  async listAll({
    page,
    limit,
    order = 'desc',
    query,
    min_duration,
    max_duration,
    genres,
    initial_date,
    end_date,
  }: ListAllMoviesDto) {
    const movieQb = this.moviesRepository.createQueryBuilder('movie');

    if (query) {
      movieQb.andWhere('movie.name ILIKE :query', {
        query: `%${query}%`,
      });
    }
    if (min_duration) {
      movieQb.andWhere('movie.durationMinutes >= :min_duration', {
        min_duration,
      });
    }
    if (max_duration) {
      movieQb.andWhere('movie.durationMinutes <= :max_duration', {
        max_duration,
      });
    }
    if (genres && genres.length > 0) {
      if (genres.length === 1) {
        movieQb.andWhere('movie.genres @> ARRAY[:genre]::movie_genre_enum[]', {
          genre: genres[0],
        });
      } else {
        const genrePlaceholders = genres
          .map((_, index) => `:genre${index}`)
          .join(',');
        const genreParams = genres.reduce(
          (acc, genre, index) => {
            acc[`genre${index}`] = genre;
            return acc;
          },
          {} as Record<string, string>,
        );

        movieQb.andWhere(
          `movie.genres && ARRAY[${genrePlaceholders}]::movie_genre_enum[]`,
          genreParams,
        );
      }
    }

    if (initial_date) {
      movieQb.andWhere('movie.release_date >= :initial_date::date', {
        initial_date,
      });
    }
    if (end_date) {
      movieQb.andWhere('movie.release_date <= :end_date::date', {
        end_date,
      });
    }

    if (page && limit) {
      movieQb.skip((page - 1) * limit);
      movieQb.take(limit);
    }

    const listingOrder = order.toUpperCase() as 'ASC' | 'DESC';

    movieQb.orderBy('movie.createdAt', listingOrder);

    return movieQb.getManyAndCount() as unknown as RepositoryListing<ListedMovieDto>;
  }

  findById(id: string): Promise<Movie | null> {
    return this.moviesRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(movie: Movie): Promise<Movie> {
    return this.moviesRepository.save(movie);
  }

  async remove(id: string): Promise<void> {
    await this.moviesRepository.delete(id);
  }

  async findMoviesReleasingSoon(days: number): Promise<Movie[]> {
    const today = moment().startOf('day');
    const futureDate = moment().add(days, 'days').endOf('day');

    return this.moviesRepository.find({
      where: {
        releaseDate: Between(today.toDate(), futureDate.toDate()),
      },
    });
  }
}
