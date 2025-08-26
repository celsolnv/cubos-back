import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Senha do usuário',
    example: 'minhasenha123',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @IsString({ message: 'A senha deve ser uma string.' })
  password: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    minLength: 2,
  })
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório.' })
  @IsString({ message: 'O nome de usuário deve ser uma string.' })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@exemplo.com',
    format: 'email',
  })
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  @IsEmail({}, { message: 'O email deve ser um endereço de e-mail válido.' })
  email: string;
}
