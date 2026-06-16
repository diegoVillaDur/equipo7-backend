import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Resena } from '../../resenas/entities/resena.entity';

@Entity('libros')
export class Libro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  autores: string;

  @Column()
  editorial: string;

  @Column()
  genero: string;

  @Column({ type: 'text', nullable: true })
  sinopsis: string;

  @Column({ nullable: true })
  imagen: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Resena, (resena) => resena.libro)
  resenas: Resena[];
}
