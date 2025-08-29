import { DataSource, EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Movie } from '../../entities/movie.entity';
import { AbstractMoviesRepository } from '../abstract.movies.repository';
import { ListAllMoviesDto } from '../../dto/list-movies.dto';
import { ListedMovieDto } from '../../dto/listed-movie.dto';
import { RepositoryListing } from 'src/types/modules/repository-listing-mode';

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
    isActive,
  }: ListAllMoviesDto) {
    const movieQb = this.moviesRepository.createQueryBuilder('movie');

    if (isActive !== undefined) {
      movieQb.andWhere('movie.isActive = :isActive', {
        isActive,
      });
    }

    if (query) {
      movieQb.andWhere('movie.name ILIKE :query', {
        query: `%${query}%`,
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
}
