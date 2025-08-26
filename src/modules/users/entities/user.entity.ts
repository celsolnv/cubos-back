import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false,
  })
  password?: string | null;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  public fromDto(dto: CreateUserDto): void {
    this.name = dto.name ?? this.name;
    this.email = dto.email ?? this.email;

    if ('password' in dto && dto.password !== null) {
      this.password = dto.password;
    }
  }

  public toDto(): CreateUserDto {
    return {
      name: this.name,
      email: this.email,
      password: this.password || '',
    };
  }
}
