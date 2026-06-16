import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { LibrosModule } from './libros/libros.module';
import { ResenasModule } from './resenas/resenas.module';
import { AfinidadModule } from './afinidad/afinidad.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { Usuario } from './usuarios/entities/usuario.entity';
import { Libro } from './libros/entities/libro.entity';
import { Resena } from './resenas/entities/resena.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: parseInt(config.get('DB_PORT', '5432')),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'password'),
        database: config.get('DB_NAME', 'burrito_lector'),
        entities: [Usuario, Libro, Resena],
        synchronize: config.get('NODE_ENV') !== 'production',
        ssl:
          config.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
      inject: [ConfigService],
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    AuthModule,
    UsuariosModule,
    LibrosModule,
    ResenasModule,
    AfinidadModule,
    DashboardModule,
  ],
})
export class AppModule {}
