import { HttpStatus, Injectable, Logger } from '@nestjs/common';
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
import { S3Service } from '../s3/s3.service';
import { isBefore } from 'date-fns';
import { RepositoryListing } from '@/types/modules/repository-listing-mode';
import { ListedMovieDto } from './dto';
@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);
  constructor(
    private movieRepository: AbstractMoviesRepository,
    private s3Service: S3Service,
  ) {}

  async create(createMovieDto: CreateMovieDto, file?: Express.Multer.File) {
    const movie = new Movie();
    movie.fromDto(createMovieDto);
    if (!movie.bannerUrl && file) {
      const { url, key, expiresAt } = await this.uploadBanner(file);
      movie.bannerUrl = url;
      movie.bannerKey = key;
      movie.bannerExpiresAt = expiresAt;
    }

    const createdMovie = await this.movieRepository.create(movie);
    return createdMovie;
  }

  async listAll(
    params: ListAllMoviesDto,
  ): Promise<RepositoryListing<ListedMovieDto>> {
    const query = await this.movieRepository.listAll(params);
    const movies = query[0].map(async (movie) => {
      if (movie.bannerKey) {
        const hasExpired =
          movie.bannerExpiresAt && isBefore(movie.bannerExpiresAt, new Date());
        if (hasExpired) {
          const { url, expiresAt } = await this.s3Service.getPresignedUrl(
            movie.bannerKey,
          );
          movie.bannerUrl = url;
          movie.bannerExpiresAt = expiresAt;
          this.update(movie.id, movie);
        }
      }
      return movie;
    });

    const moviesListed = await Promise.all(movies);

    return [moviesListed, query[1]];
  }

  async update(
    id: string,
    updateMovieDto: UpdateMovieDto,
    file?: Express.Multer.File,
  ) {
    const movie = await this.findById({ id, mode: 'ensureExistence' });

    movie.fromDto(updateMovieDto);
    if (file) {
      if (movie.bannerKey) {
        await this.s3Service.deleteObject(movie.bannerKey);
      }
      const { url, key, expiresAt } = await this.uploadBanner(file);
      movie.bannerUrl = url;
      movie.bannerKey = key;
      movie.bannerExpiresAt = expiresAt;
    }

    return await this.movieRepository.update(movie);
  }

  async remove(id: string) {
    const movie = await this.findById({
      id,
      mode: 'ensureExistence',
    });
    if (movie.bannerKey) {
      await this.s3Service.deleteObject(movie.bannerKey);
    }

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

  private async uploadBanner(file: Express.Multer.File) {
    const { key } = await this.s3Service.uploadImage(file);
    const { url, expiresAt } = await this.s3Service.getPresignedUrl(key);
    return { url, key, expiresAt };
  }

  async findMoviesReleasingSoon(days: number): Promise<Movie[]> {
    return this.movieRepository.findMoviesReleasingSoon(days);
  }
}
