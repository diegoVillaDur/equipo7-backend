import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class CreateResenaDto {
  @IsInt()
  libroId: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  puntuacion: number;
}
