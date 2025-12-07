import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Payment } from './Payment';
import { Category } from './Category';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  firstName!: string;

  @Column({ type: 'varchar' })
  lastName!: string;

  @Column({ type: 'varchar', unique: true })
  studentId!: string;

  @Column({ type: 'varchar' })
  class!: string;

  @Column({ type: 'varchar', nullable: true })
  email?: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  // Student has many Payments
  @OneToMany(() => Payment, payment => payment.student)
  payments!: Payment[];

  // Student belongs to many Categories
  @ManyToMany(() => Category, category => category.students)
  @JoinTable()
  categories!: Category[];

  @Column({ type: 'boolean', default: false })
  isDeleted!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}