import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToMany,
  OneToMany 
} from 'typeorm';
import { Payment } from './Payment';
import { Student } from './Student';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  name!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @Column({type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  // Category has many Payments
  @OneToMany(() => Payment, payment => payment.category)
  payments!: Payment[];


  @Column({ type: 'boolean', default: false })
  isDeleted!: boolean;

  // Category belongs to many Students
  @ManyToMany(() => Student, student => student.categories)
  students!: Student[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

}