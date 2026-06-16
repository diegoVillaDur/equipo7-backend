import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenasController } from './resenas.controller';
import { ResenasService } from './resenas.service';
import { Resena } from './entities/resena.entity';
import { Libro } from '../libros/entities/libro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resena, Libro])],
  controllers: [ResenasController],
  providers: [ResenasService],
  exports: [ResenasService, TypeOrmModule],
})
export class ResenasModule {}
