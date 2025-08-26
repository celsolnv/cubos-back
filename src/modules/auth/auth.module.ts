import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { environmentVariables } from 'src/config/environment-variables';
import { AbstractLoginAttemptRepository } from './repositories/abstract.login-attempts.repository';
import { LoginAttemptRepositoryTypeorm } from './repositories/typeorm/login-attempts.repository';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      global: true,
      secret: environmentVariables.JWT_SECRET,
      signOptions: { expiresIn: environmentVariables.JWT_EXPIRES },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    {
      provide: AbstractLoginAttemptRepository,
      useClass: LoginAttemptRepositoryTypeorm,
    },
  ],
  exports: [
    AuthService,
    {
      provide: AbstractLoginAttemptRepository,
      useClass: LoginAttemptRepositoryTypeorm,
    },
  ],
})
export class AuthModule {}
