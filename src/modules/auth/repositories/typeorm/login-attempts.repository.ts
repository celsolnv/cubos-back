import { LoginAttempt } from '../../entities/login-attempts.entity';
import { Injectable } from '@nestjs/common';
import { AbstractLoginAttemptRepository } from '../abstract.login-attempts.repository';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateLoginAttemptsDto } from '../../dto/create-login-attempts.dto';

@Injectable()
export class LoginAttemptRepositoryTypeorm extends AbstractLoginAttemptRepository {
  private repository: Repository<LoginAttempt>;
  private entityManager: EntityManager;

  constructor(dataSource: DataSource) {
    super();

    this.entityManager = dataSource.createEntityManager();
    this.repository = this.entityManager.getRepository(LoginAttempt);
  }
  async findByUserId(userId: string): Promise<LoginAttempt | null> {
    return await this.repository.findOne({ where: { userId } });
  }
  async create(loginAttempt: CreateLoginAttemptsDto): Promise<LoginAttempt> {
    return await this.repository.save(loginAttempt);
  }
  async update(loginAttempt: LoginAttempt): Promise<LoginAttempt> {
    return await this.repository.save(loginAttempt);
  }
}
