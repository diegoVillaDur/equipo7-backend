import {
  Injectable, NotFoundException, ConflictException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resena } from './entities/resena.entity';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Libro } from '../libros/entities/libro.entity';

@Injectable()
export class ResenasService {
  constructor(
    @InjectRepository(Resena)
    private readonly resenaRepo: Repository<Resena>,
    @InjectRepository(Libro)
    private readonly libroRepo: Repository<Libro>,
  ) {}

  async create(dto: CreateResenaDto, usuario: Usuario) {
    const libro = await this.libroRepo.findOne({ where: { id: dto.libroId } });
    if (!libro) throw new NotFoundException(`Libro #${dto.libroId} no encontrado`);

    const existe = await this.resenaRepo.findOne({
      where: { usuario: { id: usuario.id }, libro: { id: dto.libroId } },
    });
    if (existe) throw new ConflictException('Ya calificaste este libro. Usa el endpoint de edición.');

    const resena = this.resenaRepo.create({ puntuacion: dto.puntuacion, usuario, libro });
    return this.resenaRepo.save(resena);
  }

  async findMias(usuario: Usuario) {
    return this.resenaRepo.find({
      where: { usuario: { id: usuario.id } },
      relations: { libro: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByLibro(libroId: number) {
    return this.resenaRepo.find({
      where: { libro: { id: libroId } },
      relations: { usuario: true },
    });
  }

  async update(id: number, dto: UpdateResenaDto, usuario: Usuario) {
    const resena = await this.resenaRepo.findOne({
      where: { id },
      relations: { usuario: true },
    });
    if (!resena) throw new NotFoundException(`Reseña #${id} no encontrada`);
    if (resena.usuario.id !== usuario.id)
      throw new ForbiddenException('No puedes editar la reseña de otro usuario');

    resena.puntuacion = dto.puntuacion;
    return this.resenaRepo.save(resena);
  }

  async remove(id: number, usuario: Usuario) {
    const resena = await this.resenaRepo.findOne({
      where: { id },
      relations: { usuario: true },
    });
    if (!resena) throw new NotFoundException(`Reseña #${id} no encontrada`);
    if (resena.usuario.id !== usuario.id)
      throw new ForbiddenException('No puedes eliminar la reseña de otro usuario');

    await this.resenaRepo.remove(resena);
    return { mensaje: 'Reseña eliminada' };
  }

  async promedioGeneral(): Promise<number> {
    const result = await this.resenaRepo
      .createQueryBuilder('r')
      .select('AVG(r.puntuacion)', 'promedio')
      .getRawOne();
    return parseFloat(result?.promedio ?? '0') || 0;
  }
}
