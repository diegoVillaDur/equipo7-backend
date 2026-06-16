import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LibrosService } from '../libros/libros.service';
import { ResenasService } from '../resenas/resenas.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly librosService: LibrosService,
    private readonly resenasService: ResenasService,
  ) {}

  async getEstadisticas() {
    const [lectores, libros, promedioRating] = await Promise.all([
      this.usuariosService.contarLectores(),
      this.librosService.contar(),
      this.resenasService.promedioGeneral(),
    ]);

    return {
      lectores,
      libros,
      promedioRating: Math.round(promedioRating * 10) / 10,
    };
  }
}
