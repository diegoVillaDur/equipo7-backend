import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUsuario } from '../../usuarios/entities/usuario.entity';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.getAllAndOverride<RolUsuario[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!rolesRequeridos) return true;

    const { user } = context.switchToHttp().getRequest();
    const tieneRol = rolesRequeridos.includes(user?.rol);
    if (!tieneRol) throw new ForbiddenException('No tienes permisos para esta acción');
    return tieneRol;
  }
}
