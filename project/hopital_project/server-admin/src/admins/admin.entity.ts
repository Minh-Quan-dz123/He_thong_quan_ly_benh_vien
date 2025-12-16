import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Department } from '../departments/department.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false })
  fullName: string;

  @Column({ unique: true ,nullable: false })
  email: string;

  @Column({nullable: false })
  phone: string;

  @Column({nullable: false })
  password: string;

  @OneToMany(() => Department, d => d.admin)
  departments: Department[];
}
