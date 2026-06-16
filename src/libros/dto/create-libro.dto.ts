import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateLibroDto {
  @IsString()
  @MinLength(1)
  titulo: string;

  @IsString()
  autores: string;

  @IsString()
  editorial: string;

  @IsString()
  genero: string;

  @IsOptional()
  @IsString()
  sinopsis?: string;
}
