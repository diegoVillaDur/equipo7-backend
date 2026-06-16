import {
  Controller, Get, Post, Put, Delete,
  Param, Body, ParseIntPipe,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@Controller('resenas')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformInterceptor)
export class ResenasController {
  constructor(private readonly resenasService: ResenasService) {}

  // POST /api/resenas — el lector puntúa un libro
  @Post()
  create(@Body() dto: CreateResenaDto, @GetUser() usuario: Usuario) {
    return this.resenasService.create(dto, usuario);
  }

  // GET /api/resenas/mias — puntuaciones del usuario actual
  @Get('mias')
  findMias(@GetUser() usuario: Usuario) {
    return this.resenasService.findMias(usuario);
  }

  // GET /api/resenas/libro/:libroId — reseñas de un libro específico
  @Get('libro/:libroId')
  findByLibro(@Param('libroId', ParseIntPipe) libroId: number) {
    return this.resenasService.findByLibro(libroId);
  }

  // PUT /api/resenas/:id — editar mi propia reseña
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateResenaDto,
    @GetUser() usuario: Usuario,
  ) {
    return this.resenasService.update(id, dto, usuario);
  }

  // DELETE /api/resenas/:id — eliminar mi propia reseña
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() usuario: Usuario) {
    return this.resenasService.remove(id, usuario);
  }
}
