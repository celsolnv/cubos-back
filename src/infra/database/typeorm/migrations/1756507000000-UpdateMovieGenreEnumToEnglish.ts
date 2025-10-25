import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMovieGenreEnumToEnglish1756507000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Atualizar enum de status dos filmes
    await queryRunner.query(`
      ALTER TYPE movie_status_enum RENAME VALUE 'lançado' TO 'RELEASED';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_status_enum RENAME VALUE 'em produção' TO 'IN_PRODUCTION';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_status_enum RENAME VALUE 'pós-produção' TO 'POST_PRODUCTION';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_status_enum RENAME VALUE 'pré-produção' TO 'PRE_PRODUCTION';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_status_enum RENAME VALUE 'cancelado' TO 'CANCELLED';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_status_enum RENAME VALUE 'em espera' TO 'ON_HOLD';
    `);

    // Atualizar enum de gêneros dos filmes
    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Ação' TO 'ACTION';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Aventura' TO 'ADVENTURE';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Animação' TO 'ANIMATION';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Comédia' TO 'COMEDY';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Crime' TO 'CRIME';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Documentário' TO 'DOCUMENTARY';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Drama' TO 'DRAMA';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Família' TO 'FAMILY';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Fantasia' TO 'FANTASY';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Terror' TO 'HORROR';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Mistério' TO 'MYSTERY';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Romance' TO 'ROMANCE';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Ficção Científica' TO 'SCI_FI';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Suspense' TO 'THRILLER';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Guerra' TO 'WAR';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'Faroeste' TO 'WESTERN';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter enum de status dos filmes
    await queryRunner.query(`
      ALTER TYPE movie_status_enum RENAME VALUE 'RELEASED' TO 'lançado';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_status_enum RENAME VALUE 'IN_PRODUCTION' TO 'em produção';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_status_enum RENAME VALUE 'POST_PRODUCTION' TO 'pós-produção';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_status_enum RENAME VALUE 'PRE_PRODUCTION' TO 'pré-produção';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_status_enum RENAME VALUE 'CANCELLED' TO 'cancelado';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_status_enum RENAME VALUE 'ON_HOLD' TO 'em espera';
    `);

    // Reverter enum de gêneros dos filmes
    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'ACTION' TO 'Ação';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'ADVENTURE' TO 'Aventura';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'ANIMATION' TO 'Animação';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'COMEDY' TO 'Comédia';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'CRIME' TO 'Crime';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'DOCUMENTARY' TO 'Documentário';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'DRAMA' TO 'Drama';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'FAMILY' TO 'Família';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'FANTASY' TO 'Fantasia';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'HORROR' TO 'Terror';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'MYSTERY' TO 'Mistério';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'ROMANCE' TO 'Romance';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'SCI_FI' TO 'Ficção Científica';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'THRILLER' TO 'Suspense';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'WAR' TO 'Guerra';
    `);

    await queryRunner.query(`
      ALTER TYPE movie_genre_enum RENAME VALUE 'WESTERN' TO 'Faroeste';
    `);
  }
}
