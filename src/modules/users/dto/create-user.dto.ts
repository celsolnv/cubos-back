import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @IsString({ message: 'A senha deve ser uma string.' })
  password: string;

  @IsNotEmpty({ message: 'O nome de usuário é obrigatório.' })
  @IsString({ message: 'O nome de usuário deve ser uma string.' })
  name: string;

  @IsNotEmpty({ message: 'O email é obrigatório.' })
  @IsEmail({}, { message: 'O email deve ser um endereço de e-mail válido.' })
  email: string;
}
