import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  nombreCompleto: string;

  @IsEmail()
  correo: string;

  @IsString()
  @MinLength(6)
  clave: string;
}
