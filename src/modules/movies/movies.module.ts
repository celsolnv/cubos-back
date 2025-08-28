import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { AbstractMoviesRepository } from './repositories/abstract.movies.repository';
import { MoviesTypeormRepository } from './repositories/typeorm/movies.repository';

@Module({
  controllers: [MoviesController],
  exports: [
    MoviesService,
    {
      provide: AbstractMoviesRepository,
      useClass: MoviesTypeormRepository,
    },
  ],
  providers: [
    MoviesService,
    {
      provide: AbstractMoviesRepository,
      useClass: MoviesTypeormRepository,
    },
  ],
})
export class MoviesModule {}
