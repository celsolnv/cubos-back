import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { NotificationService } from './notifications.service';
import { environmentVariables } from '@/config/environment-variables';

@Module({
  providers: [
    NotificationService,
    {
      provide: 'RESEND_CLIENT',
      useFactory: () => {
        const apiKey = environmentVariables.RESEND_API_KEY;
        if (!apiKey) {
          throw new Error(
            'RESEND_API_KEY não foi definida nas variáveis de ambiente.',
          );
        }
        return new Resend(apiKey);
      },
      inject: [ConfigService],
    },
  ],
  exports: [NotificationService],
})
export class NotificationsModule {}
