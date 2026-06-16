import { Controller, Get, Param, ParseIntPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolUsuario } from './entities/usuario.entity';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // GET /api/usuarios — solo admin
  @Get()
  @Roles(RolUsuario.ADMIN)
  findAll() {
    return this.usuariosService.findAll();
  }

  // GET /api/usuarios/:id
  @Get(':id')
  @Roles(RolUsuario.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }
}
