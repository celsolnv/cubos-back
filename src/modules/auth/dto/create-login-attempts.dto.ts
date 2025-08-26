import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLoginAttemptsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  attempts: number;

  @IsOptional()
  blockedUntil: Date | null;
}
