import {
  DataSource,
  EntityManager,
  FindOptionsSelectByString,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { AbstractUsersRepository } from '../abstract.users.repository';

@Injectable()
export class UsersTypeormRepository extends AbstractUsersRepository {
  private readonly usersRepository: Repository<User>;
  private readonly entityManager: EntityManager;

  constructor(dataSource: DataSource) {
    super();

    this.entityManager = dataSource.createEntityManager();
    this.usersRepository = this.entityManager.getRepository(User);
  }

  public async create(user: User) {
    return this.entityManager.transaction(async (transactionManager) => {
      return await transactionManager.save(user);
    });
  }

  findByName(name: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        name: name,
      },
      relations: ['role'],
    });
  }

  async findByEmail({
    email,
    withPassword,
  }: {
    email: string;
    withPassword?: boolean;
  }): Promise<User | null> {
    const userQb = this.usersRepository.createQueryBuilder('user');
    userQb.where('LOWER(user.email) = LOWER(:email)', { email });

    if (withPassword) {
      userQb.addSelect('user.password');
    }

    return userQb.getOne();
  }

  async findById(id: string, withPassword = false): Promise<User | null> {
    const selectFields = [
      'id',
      'name',
      'email',
      'createdAt',
      'updatedAt',
    ] as FindOptionsSelectByString<User>;
    if (withPassword) {
      selectFields.push('password');
    }
    return this.usersRepository.findOne({
      where: {
        id,
      },
      select: selectFields,
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
