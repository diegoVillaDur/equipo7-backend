import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolUsuario } from '../usuarios/entities/usuario.entity';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN)
@UseInterceptors(TransformInterceptor)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // GET /api/dashboard — estadísticas para el panel admin
  @Get()
  getEstadisticas() {
    return this.dashboardService.getEstadisticas();
  }
}
