import { CreateLoginAttemptsDto } from '../dto/create-login-attempts.dto';
import { LoginAttempt } from '../entities/login-attempts.entity';

export abstract class AbstractLoginAttemptRepository {
  abstract findByUserId(userId: string): Promise<LoginAttempt | null>;
  abstract create(loginAttempt: CreateLoginAttemptsDto): Promise<LoginAttempt>;
  abstract update(loginAttempt: CreateLoginAttemptsDto): Promise<LoginAttempt>;
}
