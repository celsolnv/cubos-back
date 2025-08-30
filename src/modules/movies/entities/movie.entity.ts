import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { MovieStatus, MovieGenre } from '../constants';
import { ColumnNumericTransformer } from '@/utils/helpers/columnNumericTransformer';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    name: 'original_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  originalName?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: MovieStatus.RELEASED,
  })
  status: MovieStatus;

  @Column({
    name: 'release_date',
    type: 'date',
    nullable: true,
  })
  releaseDate?: Date;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  budget?: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  revenue?: number;

  @Column({
    type: 'varchar',
    name: 'banner_url',
    length: 500,
    nullable: true,
  })
  bannerUrl?: string;

  @Column({
    type: 'text',
    array: true,
    nullable: true,
    default: () => "'{}'",
    transformer: {
      to: (val: MovieGenre[] | null) => val,
      from: (val: string | null) => val?.slice(1, -1).split(','),
    },
  })
  genres?: MovieGenre[];

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  director?: string;

  @Column({
    name: 'duration_minutes',
    type: 'integer',
    nullable: true,
  })
  durationMinutes?: number;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 1,
    nullable: true,
  })
  rating?: number;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  language?: string;

  @Column({
    type: 'bigint',
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  popularity?: number;

  @Column({
    type: 'bigint',
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  votes?: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    name: 'banner_expires_at',
    type: 'timestamp',
    nullable: true,
  })
  bannerExpiresAt?: Date;

  @Column({
    name: 'banner_key',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  bannerKey?: string;

  @Column({
    name: 'tagline',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  tagline?: string;

  public fromDto(dto: CreateMovieDto | UpdateMovieDto): void {
    this.name = dto.name;
    this.originalName = dto.originalName;
    this.description = dto.description;
    if (dto.status) this.status = dto.status;
    if (dto.releaseDate) this.releaseDate = new Date(dto.releaseDate);
    this.budget = dto.budget;
    this.revenue = dto.revenue;
    this.bannerUrl = dto.bannerUrl;
    this.genres = dto.genres;
    this.director = dto.director;
    this.durationMinutes = dto.durationMinutes;
    this.rating = dto.rating;
    this.language = dto.language;
    this.popularity = dto.popularity;
    this.votes = dto.votes;
    this.tagline = dto.tagline;
  }
}
