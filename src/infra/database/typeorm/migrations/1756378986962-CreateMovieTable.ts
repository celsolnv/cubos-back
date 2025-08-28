import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMovieTable1756378986962 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enum para status dos filmes
    await queryRunner.query(`
      CREATE TYPE movie_status_enum AS ENUM (
        'lançado',
        'em produção',
        'pós-produção',
        'pré-produção',
        'cancelado',
        'em espera'
      )
    `);

    // Criar enum para gêneros dos filmes
    await queryRunner.query(`
      CREATE TYPE movie_genre_enum AS ENUM (
        'Ação',
        'Aventura',
        'Animação',
        'Comédia',
        'Crime',
        'Documentário',
        'Drama',
        'Família',
        'Fantasia',
        'Terror',
        'Mistério',
        'Romance',
        'Ficção Científica',
        'Suspense',
        'Guerra',
        'Faroeste'
      )
    `);

    // Criar tabela de filmes
    await queryRunner.createTable(
      new Table({
        name: 'movies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'original_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'movie_status_enum',
            isNullable: false,
            default: "'lançado'",
          },
          {
            name: 'release_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'budget',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'revenue',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'banner',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'genres',
            type: 'movie_genre_enum[]',
            isNullable: true,
          },
          {
            name: 'director',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'duration_minutes',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'rating',
            type: 'decimal',
            precision: 3,
            scale: 1,
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Adicionar constraints de validação
    await queryRunner.query(`
      ALTER TABLE movies 
      ADD CONSTRAINT check_movie_name_length 
      CHECK (length(name) >= 3)
    `);

    await queryRunner.query(`
      ALTER TABLE movies 
      ADD CONSTRAINT check_movie_rating_range 
      CHECK (rating >= 0.0 AND rating <= 10.0)
    `);

    await queryRunner.query(`
      ALTER TABLE movies 
      ADD CONSTRAINT check_movie_duration_positive 
      CHECK (duration_minutes > 0)
    `);

    await queryRunner.query(`
      ALTER TABLE movies 
      ADD CONSTRAINT check_movie_budget_positive 
      CHECK (budget >= 0)
    `);

    await queryRunner.query(`
      ALTER TABLE movies 
      ADD CONSTRAINT check_movie_revenue_positive 
      CHECK (revenue >= 0)
    `);

    // Adicionar índices para melhor performance
    await queryRunner.query(`
      CREATE INDEX idx_movies_name ON movies USING gin(to_tsvector('portuguese', name))
    `);

    await queryRunner.query(`
      CREATE INDEX idx_movies_status ON movies (status)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_movies_genres ON movies USING gin(genres)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_movies_director ON movies (director)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_movies_release_date ON movies (release_date)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_movies_rating ON movies (rating)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_movies_created_at ON movies (created_at)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.query(`DROP INDEX IF EXISTS idx_movies_created_at`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_movies_rating`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_movies_release_date`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_movies_director`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_movies_genres`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_movies_status`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_movies_name`);

    // Remover constraints
    await queryRunner.query(
      `ALTER TABLE movies DROP CONSTRAINT IF EXISTS check_movie_revenue_positive`,
    );
    await queryRunner.query(
      `ALTER TABLE movies DROP CONSTRAINT IF EXISTS check_movie_budget_positive`,
    );
    await queryRunner.query(
      `ALTER TABLE movies DROP CONSTRAINT IF EXISTS check_movie_duration_positive`,
    );
    await queryRunner.query(
      `ALTER TABLE movies DROP CONSTRAINT IF EXISTS check_movie_rating_range`,
    );
    await queryRunner.query(
      `ALTER TABLE movies DROP CONSTRAINT IF EXISTS check_movie_name_length`,
    );

    // Remover tabela
    await queryRunner.dropTable('movies');

    // Remover enums
    await queryRunner.query(`DROP TYPE IF EXISTS movie_genre_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS movie_status_enum`);
  }
}
