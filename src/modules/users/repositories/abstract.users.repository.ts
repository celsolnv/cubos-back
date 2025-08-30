import { User } from '../entities/user.entity';

export abstract class AbstractUsersRepository {
  abstract create(createUserDto: User): Promise<User>;
  abstract findById(id: string, withPassword?: boolean): Promise<User | null>;
  abstract findByName(name: string): Promise<User | null>;
  abstract findByEmail(params: {
    email: string;
    withPassword?: boolean;
  }): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
}
