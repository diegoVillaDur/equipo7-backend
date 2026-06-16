import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { LibrosModule } from '../libros/libros.module';
import { ResenasModule } from '../resenas/resenas.module';

@Module({
  imports: [UsuariosModule, LibrosModule, ResenasModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
