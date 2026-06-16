import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AfinidadController } from './afinidad.controller';
import { AfinidadService } from './afinidad.service';
import { Resena } from '../resenas/entities/resena.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resena, Usuario])],
  controllers: [AfinidadController],
  providers: [AfinidadService],
})
export class AfinidadModule {}
