import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resena } from '../resenas/entities/resena.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

interface VectorRatings {
  [libroId: number]: number;
}

@Injectable()
export class AfinidadService {
  constructor(
    @InjectRepository(Resena)
    private readonly resenaRepo: Repository<Resena>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async calcularAfinidad(usuarioActual: Usuario) {
    const todasLasResenas = await this.resenaRepo.find({
      relations: { usuario: true, libro: true },
    });

    if (todasLasResenas.length === 0) return [];

    const mapaRatings = new Map<number, VectorRatings>();
    const mapaNombres = new Map<number, string>();

    for (const resena of todasLasResenas) {
      const uid = resena.usuario.id;
      const lid = resena.libro.id;
      if (!mapaRatings.has(uid)) mapaRatings.set(uid, {});
      mapaRatings.get(uid)![lid] = resena.puntuacion;
      mapaNombres.set(uid, resena.usuario.nombreCompleto);
    }

    const vectorActual = mapaRatings.get(usuarioActual.id);
    if (!vectorActual || Object.keys(vectorActual).length === 0) return [];

    const resultados: {
      usuarioId: number;
      nombre: string;
      similitud: number;
      librosComunes: {
        libroId: number;
        titulo: string;
        miRating: number;
        suRating: number;
      }[];
    }[] = [];

    for (const [uid, vectorOtro] of mapaRatings.entries()) {
      if (uid === usuarioActual.id) continue;

      const similitud = this.similitudCoseno(vectorActual, vectorOtro);
      if (similitud < 0.7) continue;

      const librosComunes = this.librosEnComun(todasLasResenas, usuarioActual.id, uid);

      resultados.push({
        usuarioId: uid,
        nombre: mapaNombres.get(uid) ?? 'Desconocido',
        similitud: Math.round(similitud * 100) / 100,
        librosComunes,
      });
    }

    return resultados.sort((a, b) => b.similitud - a.similitud);
  }

  private similitudCoseno(vecA: VectorRatings, vecB: VectorRatings): number {
    const librosComunes = Object.keys(vecA).filter((lid) => lid in vecB);
    if (librosComunes.length === 0) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const lid of librosComunes) {
      const a = vecA[Number(lid)];
      const b = vecB[Number(lid)];
      dotProduct += a * b;
      normA += a * a;
      normB += b * b;
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private librosEnComun(todasLasResenas: Resena[], uidA: number, uidB: number) {
    const resenasA = todasLasResenas.filter((r) => r.usuario.id === uidA);
    const resenasB = todasLasResenas.filter((r) => r.usuario.id === uidB);
    const mapB = new Map(resenasB.map((r) => [r.libro.id, r.puntuacion]));

    return resenasA
      .filter((r) => mapB.has(r.libro.id))
      .map((r) => ({
        libroId: r.libro.id,
        titulo: r.libro.titulo,
        miRating: r.puntuacion,
        suRating: mapB.get(r.libro.id)!,
      }));
  }
}
