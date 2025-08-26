import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreateLoginAttemptsDto } from '../dto/create-login-attempts.dto';

@Entity('login_attempts')
export class LoginAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  attempts: number;

  @Column({ type: 'timestamp', nullable: true, name: 'blocked_until' })
  blockedUntil: Date | null;

  public fromDto(dto: CreateLoginAttemptsDto): void {
    this.userId = dto.userId;
    this.attempts = dto.attempts;
    this.blockedUntil = dto.blockedUntil;
  }
}
