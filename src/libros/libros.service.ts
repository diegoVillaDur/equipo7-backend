import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './entities/libro.entity';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private readonly libroRepo: Repository<Libro>,
  ) {}

  async create(dto: CreateLibroDto, imagenNombre?: string) {
    const libro = this.libroRepo.create({
      ...dto,
      imagen: imagenNombre ?? undefined,
    });
    return this.libroRepo.save(libro);
  }

  async findAll() {
    return this.libroRepo.find({
      relations: { resenas: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const libro = await this.libroRepo.findOne({
      where: { id },
      relations: { resenas: { usuario: true } },
    });
    if (!libro) throw new NotFoundException(`Libro #${id} no encontrado`);
    return libro;
  }

  async update(id: number, dto: UpdateLibroDto, imagenNombre?: string) {
    const libro = await this.findOne(id);

    if (imagenNombre && libro.imagen) {
      await this.borrarImagen(libro.imagen).catch(() => null);
    }

    const actualizado = Object.assign(libro, dto);
    if (imagenNombre) actualizado.imagen = imagenNombre;
    return this.libroRepo.save(actualizado);
  }

  async remove(id: number) {
    const libro = await this.findOne(id);
    if (libro.imagen) await this.borrarImagen(libro.imagen).catch(() => null);
    await this.libroRepo.remove(libro);
    return { mensaje: `Libro #${id} eliminado correctamente` };
  }

  async contar(): Promise<number> {
    return this.libroRepo.count();
  }

  async promedioRating(): Promise<number> {
    const result = await this.libroRepo
      .createQueryBuilder('libro')
      .leftJoin('libro.resenas', 'resena')
      .select('AVG(resena.puntuacion)', 'promedio')
      .getRawOne();
    return parseFloat(result?.promedio ?? '0') || 0;
  }

  private async borrarImagen(nombre: string) {
    const ruta = join(process.cwd(), 'uploads', nombre);
    await unlink(ruta);
  }
}
