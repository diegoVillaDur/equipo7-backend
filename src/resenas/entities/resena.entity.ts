import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Unique,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Libro } from '../../libros/entities/libro.entity';

@Entity('resenas')
@Unique(['usuario', 'libro'])
export class Resena {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  puntuacion: number; // 1-5

  @ManyToOne(() => Usuario, (usuario) => usuario.resenas, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Libro, (libro) => libro.resenas, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'libro_id' })
  libro: Libro;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
