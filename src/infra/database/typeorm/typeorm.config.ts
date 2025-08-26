import { environmentVariables } from '../../../config/environment-variables';
import { DataSource, DataSourceOptions } from 'typeorm';

const dbDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: environmentVariables.DATABASE_URL,
  entities: ['./**/*.entity{ .ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsTableName: 'db_migrations_typeorm',
  synchronize: false,
  migrationsRun: false,
};

const dbDataSource = new DataSource(dbDataSourceOptions);

export default dbDataSource;
export { dbDataSourceOptions };
