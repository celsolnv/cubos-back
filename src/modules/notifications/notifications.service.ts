import { Inject, Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { Movie } from '../movies';
import { User } from '../users/entities/user.entity';
import { format } from 'date-fns';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(@Inject('RESEND_CLIENT') private readonly resend: Resend) {}

  async sendUpcomingMovieEmail(user: User, movie: Movie): Promise<void> {
    const releaseDate = format(new Date(movie.releaseDate), 'dd/MM/yyyy');

    try {
      const { data, error } = await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: [user.email],
        subject: `Lançamento em breve: ${movie.name}!`,
        html: `
          <h1>Olá, ${user.name}!</h1>
          <p>Temos uma novidade que você vai adorar!</p>
          <p>O filme <strong>${movie.name}</strong> está chegando aos cinemas no dia <strong>${releaseDate}</strong>.</p>
          <p>Prepare a pipoca!</p>
        `,
      });

      if (error) {
        this.logger.error(`Falha ao enviar e-mail para ${user.email}`, error);
        return;
      }

      this.logger.log(
        `E-mail enviado com sucesso para ${user.email}. ID: ${data.id}`,
      );
    } catch (err) {
      this.logger.error(
        `Erro inesperado ao enviar e-mail para ${user.email}`,
        err,
      );
    }
  }
}
