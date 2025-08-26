import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import AppException from 'src/exception-filters/app-exception/app-exception';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { AbstractLoginAttemptRepository } from './repositories/abstract.login-attempts.repository';
import { LoginAttempt } from './entities/login-attempts.entity';
import moment from 'moment';

@Injectable()
export class AuthService {
  private readonly MAX_ATTEMPTS = 3; // Número máximo de tentativas
  private readonly BLOCK_TIME = 15 * 60 * 1000; // 15 minutos em milissegundos

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private loginAttemptsRepository: AbstractLoginAttemptRepository,
  ) {}

  async signIn({ email, password }: SignInDto) {
    // TODO: find by name or email
    const user = await this.usersService.findByEmail({
      email,
      withPassword: true,
    });

    if (!user || !user.password) {
      throw new AppException('E-mail ou senha inválidos', 401);
    }
    // Check login attempts
    const userAttempt = await this.checkLoginAttempts(user?.id);

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      userAttempt.attempts += 1;
      await this.loginAttemptsRepository.update(userAttempt);
      throw new AppException('Email ou senha inválidos', 401);
    }

    return this.returnLoginSuccess(user);
  }

  private async checkLoginAttempts(userId: string) {
    let userAttempt = await this.loginAttemptsRepository.findByUserId(userId);

    if (!userAttempt) {
      const loginAttempt = new LoginAttempt();
      loginAttempt.fromDto({
        userId,
        attempts: 0,
        blockedUntil: null,
      });
      userAttempt = await this.loginAttemptsRepository.create(loginAttempt);
    }

    if (userAttempt.blockedUntil && userAttempt.blockedUntil > new Date()) {
      const timeToUnlock = moment(userAttempt.blockedUntil).diff(
        new Date(),
        'minutes',
      );
      throw new AppException(
        `Usuário bloqueado por excesso de tentativas! Tente novamente em ${timeToUnlock} minutos `,
        429,
      );
    }
    if (userAttempt.attempts >= this.MAX_ATTEMPTS) {
      userAttempt.blockedUntil = new Date(Date.now() + this.BLOCK_TIME);
      userAttempt.attempts = 0; // Reset attempts após o bloqueio
      await this.loginAttemptsRepository.update(userAttempt);
      throw new AppException(
        `Usuário bloqueado por excesso de tentativas! Tente novamente em ${this.BLOCK_TIME / 60000} minutos `,
        429,
      );
    }

    return userAttempt;
  }

  private returnLoginSuccess(user: User) {
    const payload = {
      id: user.id,
    };

    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }
}
