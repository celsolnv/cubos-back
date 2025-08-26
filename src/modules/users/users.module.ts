import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AbstractUsersRepository } from './repositories/abstract.users.repository';
import { UsersTypeormRepository } from './repositories/typeorm/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  exports: [
    UsersService,
    {
      provide: AbstractUsersRepository,
      useClass: UsersTypeormRepository,
    },
  ],
  providers: [
    UsersService,
    {
      provide: AbstractUsersRepository,
      useClass: UsersTypeormRepository,
    },
  ],
})
export class UserModule {}
