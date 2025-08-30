import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbDataSourceOptions } from './infra/database/typeorm/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/users.module';
import { JwtAuthGuard } from './modules/auth/strategy/jwt-auth.guard';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AppExceptionFilter } from './exception-filters/app-exception/app-exception.filter';
import { MoviesModule } from './modules/movies/movies.module';
import { S3Module } from './modules/s3/s3.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './modules/tasks/tasks.service';
import { TasksModule } from './modules/tasks/tasks.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const schema =
          process.env.NODE_ENV === 'test' ? 'test_schema' : 'public';
        return {
          ...dbDataSourceOptions,
          autoLoadEntities: true,
          schema: schema,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [
            __dirname + '/infra/database/typeorm/migrations/**/*.ts',
          ],
          extra: {
            options: `-c search_path=${schema}`,
          },
          // logging: ['query', 'schema', 'error', 'warn', 'info', 'log'],
          migrationsTableName:
            process.env.NODE_ENV === 'test'
              ? 'migrations_test'
              : 'db_migrations_typeorm',
        };
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    S3Module,
    MoviesModule,
    TasksModule,
    NotificationsModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
    TasksService,
  ],
})
export class AppModule {}
