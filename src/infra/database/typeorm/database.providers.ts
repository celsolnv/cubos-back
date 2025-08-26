import dbDataSource from './typeorm.config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => dbDataSource.initialize(),
  },
];
