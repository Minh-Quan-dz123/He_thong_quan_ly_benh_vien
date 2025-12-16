import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Admin } from '../admins/admin.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  head_id: number; // doctor service (server khác)

  @Column({ default: 0 })
  doctorCount: number;

  @Column({ default: 0 })
  patientCount: number;

  @ManyToOne(() => Admin, admin => admin.departments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;
}
