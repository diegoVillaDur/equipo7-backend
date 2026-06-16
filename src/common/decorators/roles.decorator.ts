import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../../usuarios/entities/usuario.entity';
import { ROLES_KEY } from '../../auth/guards/roles.guard';

export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);
