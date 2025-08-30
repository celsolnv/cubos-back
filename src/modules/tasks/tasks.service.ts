import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MoviesService } from '../movies/movies.service';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notifications/notifications.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly movieService: MoviesService,
    private readonly userService: UsersService,
    @Inject(NotificationService)
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM, {
    name: 'notifyUpcomingMovies',
    timeZone: 'America/Sao_Paulo',
  })
  async handleCron() {
    this.logger.debug(
      'Iniciando verificação de filmes próximos do lançamento...',
    );

    const upcomingMovies = await this.movieService.findMoviesReleasingSoon(1);

    if (upcomingMovies.length === 0) {
      this.logger.debug('Nenhum filme próximo do lançamento encontrado.');
      return;
    }

    this.logger.log(
      `${upcomingMovies.length} filme(s) encontrado(s) próximo(s) do lançamento.`,
    );

    const users = await this.userService.findAllUsers();

    if (users.length === 0) {
      this.logger.warn('Nenhum usuário encontrado para notificar.');
      return;
    }

    for (const movie of upcomingMovies) {
      for (const user of users) {
        this.logger.debug(
          `Enviando notificação para ${user.email} sobre o filme ${movie.name}`,
        );
        await this.notificationService.sendUpcomingMovieEmail(user, movie);
      }
    }

    this.logger.debug('Processo de notificação finalizado.');
  }
}
