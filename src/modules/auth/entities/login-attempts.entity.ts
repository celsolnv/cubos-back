import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  public fromDto(dto: CreateLoginAttemptsDto): void {
    this.userId = dto.userId;
    this.attempts = dto.attempts;
    this.blockedUntil = dto.blockedUntil;
  }
}
