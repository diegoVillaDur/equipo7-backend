import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AfinidadService } from './afinidad.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@Controller('afinidad')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformInterceptor)
export class AfinidadController {
  constructor(private readonly afinidadService: AfinidadService) {}

  // GET /api/afinidad — usuarios muy afines al lector actual
  @Get()
  calcular(@GetUser() usuario: Usuario) {
    return this.afinidadService.calcularAfinidad(usuario);
  }
}
