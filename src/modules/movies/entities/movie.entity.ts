import {
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Entity,
} from 'typeorm';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { MovieStatus, MovieGenre } from '../constants';

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
  })
  budget?: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  revenue?: number;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  banner?: string;

  @Column({
    type: 'text',
    array: true,
    nullable: true,
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

  @DeleteDateColumn({ select: false })
  deletedAt?: Date;

  public fromDto(dto: CreateMovieDto | UpdateMovieDto): void {
    this.name = dto.name;
    this.originalName = dto.originalName;
    this.description = dto.description;
    if (dto.status) this.status = dto.status;
    if (dto.releaseDate) this.releaseDate = new Date(dto.releaseDate);
    this.budget = dto.budget;
    this.revenue = dto.revenue;
    this.banner = dto.banner;
    this.genres = dto.genres;
    this.director = dto.director;
    this.durationMinutes = dto.durationMinutes;
    this.rating = dto.rating;
  }
}
