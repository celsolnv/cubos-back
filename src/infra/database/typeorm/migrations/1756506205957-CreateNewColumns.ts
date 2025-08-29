import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class CreateNewColumns1756506205957 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('movies', [
      new TableColumn({
        name: 'language',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'tagline',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'popularity',
        type: 'bigint',
        isNullable: true,
      }),
      new TableColumn({
        name: 'votes',
        type: 'bigint',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('movies', [
      'language',
      'popularity',
      'votes',
    ]);
  }
}
