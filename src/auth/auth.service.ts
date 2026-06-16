import {
  Injectable, ConflictException, UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { Usuario, RolUsuario } from '../usuarios/entities/usuario.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existe = await this.usuarioRepo.findOne({ where: { correo: dto.correo } });
    if (existe) throw new ConflictException('El correo ya está registrado');

    const hash = await bcrypt.hash(dto.clave, 10);
    const usuario = this.usuarioRepo.create({
      nombreCompleto: dto.nombreCompleto,
      correo: dto.correo,
      clave: hash,
      rol: RolUsuario.LECTOR,
    });
    await this.usuarioRepo.save(usuario);

    return this.generarToken(usuario);
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuarioRepo.findOne({ where: { correo: dto.correo } });
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const claveValida = await bcrypt.compare(dto.clave, usuario.clave);
    if (!claveValida) throw new UnauthorizedException('Credenciales inválidas');

    return this.generarToken(usuario);
  }

  async loginAdmin(dto: LoginDto) {
    const usuario = await this.usuarioRepo.findOne({ where: { correo: dto.correo } });
    if (!usuario || usuario.rol !== RolUsuario.ADMIN)
      throw new UnauthorizedException('Acceso denegado');

    const claveValida = await bcrypt.compare(dto.clave, usuario.clave);
    if (!claveValida) throw new UnauthorizedException('Credenciales inválidas');

    return this.generarToken(usuario);
  }

  private generarToken(usuario: Usuario) {
    const payload = { sub: usuario.id, correo: usuario.correo, rol: usuario.rol };
    return {
      token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombreCompleto: usuario.nombreCompleto,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    };
  }
}
