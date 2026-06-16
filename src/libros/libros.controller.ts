import {
  Controller, Get, Post, Put, Delete,
  Param, Body, ParseIntPipe,
  UseGuards, UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

import { LibrosService } from './libros.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolUsuario } from '../usuarios/entities/usuario.entity';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

const almacenamiento = diskStorage({
  destination: './uploads',
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  },
});

@Controller('libros')
@UseInterceptors(TransformInterceptor)
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  // GET /api/libros — público: cualquier lector autenticado puede ver la galería
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.librosService.findAll();
  }

  // GET /api/libros/:id — público: detalle de un libro
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.librosService.findOne(id);
  }

  // POST /api/libros — solo admin
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  @UseInterceptors(FileInterceptor('imagen', { storage: almacenamiento }))
  create(
    @Body() dto: CreateLibroDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.librosService.create(dto, file?.filename);
  }

  // PUT /api/libros/:id — solo admin
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  @UseInterceptors(FileInterceptor('imagen', { storage: almacenamiento }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLibroDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.librosService.update(id, dto, file?.filename);
  }

  // DELETE /api/libros/:id — solo admin
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.librosService.remove(id);
  }
}
