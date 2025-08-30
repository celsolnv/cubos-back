import { HttpStatus, Injectable } from '@nestjs/common';
import AppException from 'src/exception-filters/app-exception/app-exception';
import { CreateUserDto } from './dto/create-user.dto';
import { AbstractUsersRepository } from './repositories/abstract.users.repository';
import { User } from './entities/user.entity';
import {
  FindServiceMode,
  FindServiceResult,
} from 'src/types/modules/find-service-mode';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: AbstractUsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.findByEmail({
      email: createUserDto.email,
      mode: 'ensureNonExistence',
    });

    const user = new User();
    createUserDto.password = await hash(createUserDto.password, 12);

    user.fromDto(createUserDto);

    const createdUser = await this.userRepository.create(user);

    return createdUser;
  }

  async checkIfEmailExists(email: string) {
    await this.findByEmail({
      email: email,
      mode: 'ensureNonExistence',
    });
  }

  async findByName<Mode extends FindServiceMode>(params: {
    name: string;
    mode?: Mode;
  }) {
    const { name, mode = 'default' } = params;
    const existingUser = await this.userRepository.findByName(name);

    if (existingUser && mode === 'ensureNonExistence') {
      throw new AppException(
        `Existe outro cadastro come este nome`,
        HttpStatus.CONFLICT,
      );
    }

    if (!existingUser && mode === 'ensureExistence') {
      throw new AppException(
        `Nenhum cadastro com esse nome foi encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    return existingUser as FindServiceResult<User, Mode>;
  }

  async findById<Mode extends FindServiceMode>(params: {
    id: string;
    mode?: Mode;
    withPassword?: boolean;
  }) {
    const { id, mode = 'default', withPassword = false } = params;
    const existingUser = await this.userRepository.findById(id, withPassword);

    if (!existingUser && mode === 'ensureExistence') {
      throw new AppException(`Usuário não encontrado`, HttpStatus.NOT_FOUND);
    }

    if (existingUser && mode === 'ensureNonExistence') {
      throw new AppException(
        `Existe outro cadastro com este id`,
        HttpStatus.CONFLICT,
      );
    }

    return existingUser as FindServiceResult<User, Mode>;
  }

  async findByEmail<Mode extends FindServiceMode>(params: {
    email: string;
    mode?: Mode;
    withPassword?: boolean;
    exceptUserId?: string;
  }) {
    const { email, mode = 'default', withPassword } = params;
    const existingUser = await this.userRepository.findByEmail({
      email,
      withPassword,
    });

    if (existingUser && mode === 'ensureNonExistence') {
      if (params.exceptUserId && existingUser.id === params.exceptUserId) {
        return existingUser as FindServiceResult<User, Mode>;
      }
      throw new AppException('Já existe um colaborador com este email', 409);
    }

    if (!existingUser && mode === 'ensureExistence') {
      throw new AppException('Usuário não encontrado', 404);
    }

    return existingUser as FindServiceResult<User, Mode>;
  }

  async findAllUsers() {
    return this.userRepository.findAll();
  }
}
