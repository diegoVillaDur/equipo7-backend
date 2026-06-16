import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from '../usuarios/entities/usuario.entity';
import { Libro } from '../libros/entities/libro.entity';
import { Resena } from '../resenas/entities/resena.entity';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usuarioRepo = app.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  const libroRepo = app.get<Repository<Libro>>(getRepositoryToken(Libro));
  const resenaRepo = app.get<Repository<Resena>>(getRepositoryToken(Resena));

  // --- Usuarios ---
  const adminExiste = await usuarioRepo.findOne({ where: { correo: 'admin@burritolector.com' } });
  if (!adminExiste) {
    await usuarioRepo.save(
      usuarioRepo.create({
        nombreCompleto: 'Administrador',
        correo: 'admin@burritolector.com',
        clave: await bcrypt.hash('Admin1234!', 10),
        rol: RolUsuario.ADMIN,
      }),
    );
    console.log('✅ Admin creado: admin@burritolector.com / Admin1234!');
  }

  const lectores = [
    { nombreCompleto: 'Luis García', correo: 'luis@example.com', clave: 'Lector123!' },
    { nombreCompleto: 'Jose Martínez', correo: 'jose@example.com', clave: 'Lector123!' },
    { nombreCompleto: 'Nora López', correo: 'nora@example.com', clave: 'Lector123!' },
    { nombreCompleto: 'Ana Pérez', correo: 'ana@example.com', clave: 'Lector123!' },
  ];

  const usuariosCreados: Usuario[] = [];
  for (const l of lectores) {
    let u = await usuarioRepo.findOne({ where: { correo: l.correo } });
    if (!u) {
      u = await usuarioRepo.save(
        usuarioRepo.create({ ...l, clave: await bcrypt.hash(l.clave, 10), rol: RolUsuario.LECTOR }),
      );
      console.log(`✅ Lector creado: ${l.correo}`);
    }
    usuariosCreados.push(u);
  }

  // --- Libros ---
  const librosData = [
    {
      titulo: 'Cien años de soledad',
      autores: 'Gabriel García Márquez',
      editorial: 'Sudamericana',
      genero: 'Ficción, Realismo mágico',
      sinopsis: 'Cien años de soledad sigue a siete generaciones de los Buendía, desde que José Arcadio y Úrsula fundan Macondo guiados por un sueño, hasta su destrucción centenaria.',
    },
    {
      titulo: 'El nadador en el mar secreto',
      autores: 'William Kotzwinkle',
      editorial: 'Tusquets',
      genero: 'Ficción',
      sinopsis: 'Una historia íntima y desgarradora sobre la pérdida de un hijo.',
    },
    {
      titulo: 'La vuelta al mundo en 80 días',
      autores: 'Julio Verne',
      editorial: 'Alianza Editorial',
      genero: 'Aventura, Clásico',
      sinopsis: 'Phileas Fogg apuesta que puede dar la vuelta al mundo en solo 80 días.',
    },
    {
      titulo: 'Primer Contacto',
      autores: 'Francisco José Segovia Ramos',
      editorial: 'Trillas',
      genero: 'Ficción, Relatos, Ciencia Ficción',
      sinopsis: 'Antología de relatos sobre el primer encuentro entre la humanidad y una especie extraterrestre.',
    },
  ];

  const librosCreados: Libro[] = [];
  for (const ld of librosData) {
    let libro = await libroRepo.findOne({ where: { titulo: ld.titulo } });
    if (!libro) {
      libro = await libroRepo.save(libroRepo.create(ld));
      console.log(`✅ Libro creado: ${ld.titulo}`);
    }
    librosCreados.push(libro);
  }

  // --- Reseñas (datos del mockup) ---
  const resenasData = [
    // Luis: libros 0, 1
    { usuario: usuariosCreados[0], libro: librosCreados[0], puntuacion: 4 },
    { usuario: usuariosCreados[0], libro: librosCreados[1], puntuacion: 4 },
    // Jose: libros 0, 1
    { usuario: usuariosCreados[1], libro: librosCreados[0], puntuacion: 4 },
    { usuario: usuariosCreados[1], libro: librosCreados[1], puntuacion: 3 },
    // Nora: libro 0
    { usuario: usuariosCreados[2], libro: librosCreados[0], puntuacion: 4 },
    // Ana: libro 1
    { usuario: usuariosCreados[3], libro: librosCreados[1], puntuacion: 4 },
    // Luis: libro 3
    { usuario: usuariosCreados[0], libro: librosCreados[3], puntuacion: 3 },
  ];

  for (const rd of resenasData) {
    const existe = await resenaRepo.findOne({
      where: { usuario: { id: rd.usuario.id }, libro: { id: rd.libro.id } },
    });
    if (!existe) {
      await resenaRepo.save(resenaRepo.create(rd));
    }
  }
  console.log('✅ Reseñas de prueba cargadas');

  await app.close();
  console.log('\n🎉 Seed completado exitosamente');
}

seed().catch((e) => {
  console.error('❌ Error en seed:', e);
  process.exit(1);
});
