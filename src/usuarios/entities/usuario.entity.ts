import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Resena } from '../../resenas/entities/resena.entity';

export enum RolUsuario {
  LECTOR = 'lector',
  ADMIN = 'admin',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_completo' })
  nombreCompleto: string;

  @Column({ unique: true })
  correo: string;

  @Column()
  clave: string;

  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.LECTOR })
  rol: RolUsuario;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Resena, (resena) => resena.usuario)
  resenas: Resena[];
}
