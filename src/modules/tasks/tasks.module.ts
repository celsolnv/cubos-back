import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MoviesModule } from '../movies/movies.module';
import { UserModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [MoviesModule, UserModule, NotificationsModule],
  providers: [TasksService],
})
export class TasksModule {}
