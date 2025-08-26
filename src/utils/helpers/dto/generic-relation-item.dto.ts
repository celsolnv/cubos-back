import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenericRelationItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;
}
