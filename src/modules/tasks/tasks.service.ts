import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MoviesService } from '../movies/movies.service';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notifications/notifications.service';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';

interface FailedNotification {
  userId: string;
  movieId: string;
  attempts: number;
  lastAttempt: Date;
  error: string;
}

interface NotificationResult {
  success: boolean;
  userId: string;
  movieId: string;
  error?: string;
}

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY_MS = 5 * 60 * 1000; // 5 minutos
  private failedNotifications: Map<string, FailedNotification> = new Map();

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

    try {
      await this.processFailedNotifications();
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

      const results = await this.sendNotificationsWithRetry(
        upcomingMovies,
        users,
      );
      this.logNotificationResults(results);
    } catch (error) {
      this.logger.error('Erro crítico no processo de notificação:', error);
    }
  }

  private async processFailedNotifications(): Promise<void> {
    if (this.failedNotifications.size === 0) {
      return;
    }

    this.logger.log(
      `Processando ${this.failedNotifications.size} notificação(ões) pendente(s)...`,
    );

    const retryPromises = Array.from(this.failedNotifications.entries()).map(
      async ([key, failedNotification]) => {
        const { userId, movieId, attempts } = failedNotification;

        if (attempts >= this.MAX_RETRY_ATTEMPTS) {
          this.logger.warn(
            `Notificação para usuário ${userId} sobre filme ${movieId} excedeu máximo de tentativas. Removendo da fila.`,
          );
          this.failedNotifications.delete(key);
          return;
        }

        const timeSinceLastAttempt =
          Date.now() - failedNotification.lastAttempt.getTime();
        if (timeSinceLastAttempt < this.RETRY_DELAY_MS) {
          return;
        }

        try {
          const user = await this.userService.findById({ id: userId });
          const movie = await this.movieService.findById({ id: movieId });

          if (!user || !movie) {
            this.logger.warn(
              `Usuário ${userId} ou filme ${movieId} não encontrado. Removendo da fila.`,
            );
            this.failedNotifications.delete(key);
            return;
          }

          await this.notificationService.sendUpcomingMovieEmail(user, movie);

          this.failedNotifications.delete(key);
          this.logger.log(
            `Notificação reenviada com sucesso para ${user.email} sobre ${movie.name}`,
          );
        } catch (error) {
          failedNotification.attempts += 1;
          failedNotification.lastAttempt = new Date();
          failedNotification.error = error.message || 'Erro desconhecido';

          this.logger.warn(
            `Falha no reenvio para usuário ${userId} sobre filme ${movieId} (tentativa ${failedNotification.attempts}/${this.MAX_RETRY_ATTEMPTS}): ${error.message}`,
          );
        }
      },
    );

    await Promise.allSettled(retryPromises);
  }

  private async sendNotificationsWithRetry(
    movies: Movie[],
    users: User[],
  ): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];

    for (const movie of movies) {
      for (const user of users) {
        const result = await this.sendNotificationWithRetry(user, movie);
        results.push(result);
      }
    }

    return results;
  }

  private async sendNotificationWithRetry(
    user: User,
    movie: Movie,
  ): Promise<NotificationResult> {
    const key = `${user.id}-${movie.id}`;

    try {
      this.logger.debug(
        `Enviando notificação para ${user.email} sobre o filme ${movie.name}`,
      );

      await this.notificationService.sendUpcomingMovieEmail(user, movie);

      this.logger.debug(
        `Notificação enviada com sucesso para ${user.email} sobre ${movie.name}`,
      );

      return {
        success: true,
        userId: user.id,
        movieId: movie.id,
      };
    } catch (error) {
      const errorMessage = error.message || 'Erro desconhecido';

      this.logger.error(
        `Falha ao enviar notificação para ${user.email} sobre ${movie.name}: ${errorMessage}`,
      );

      // Adicionar à fila de retry
      this.failedNotifications.set(key, {
        userId: user.id,
        movieId: movie.id,
        attempts: 1,
        lastAttempt: new Date(),
        error: errorMessage,
      });

      return {
        success: false,
        userId: user.id,
        movieId: movie.id,
        error: errorMessage,
      };
    }
  }

  private logNotificationResults(results: NotificationResult[]): void {
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    const pending = this.failedNotifications.size;

    this.logger.log(
      `Processo de notificação finalizado. Sucessos: ${successful}, Falhas: ${failed}, Pendentes para retry: ${pending}`,
    );

    if (failed > 0) {
      this.logger.warn(
        `${failed} notificação(ões) falharam e serão tentadas novamente automaticamente.`,
      );
    }
  }

  clearFailedNotifications(): void {
    this.failedNotifications.clear();
    this.logger.log('Notificações pendentes limpas.');
  }

  getFailedNotificationsStats(): {
    total: number;
    details: FailedNotification[];
  } {
    return {
      total: this.failedNotifications.size,
      details: Array.from(this.failedNotifications.values()),
    };
  }
}
