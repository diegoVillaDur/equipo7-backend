import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async findAll() {
    return this.usuarioRepo.find({
      select: {
        id: true,
        nombreCompleto: true,
        correo: true,
        rol: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { id },
      select: {
        id: true,
        nombreCompleto: true,
        correo: true,
        rol: true,
        createdAt: true,
      },
    });
    if (!usuario) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return usuario;
  }

  async contarLectores(): Promise<number> {
    return this.usuarioRepo.count({ where: { rol: RolUsuario.LECTOR } });
  }
}
