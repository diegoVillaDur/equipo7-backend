import { IsInt, Max, Min } from 'class-validator';

export class UpdateResenaDto {
  @IsInt()
  @Min(1)
  @Max(5)
  puntuacion: number;
}
