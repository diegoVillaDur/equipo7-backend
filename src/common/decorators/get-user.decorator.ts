import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export const GetUser = createParamDecorator(
  (data: keyof Usuario | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: Usuario = request.user;
    return data ? user?.[data] : user;
  },
);
