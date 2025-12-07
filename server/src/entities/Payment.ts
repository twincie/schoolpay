import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { Student } from './Student';
import { Category } from './Category';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Student, student => student.payments, { 
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'student_id' })
  student!: Student;

  @ManyToOne(() => Category, category => category.payments, { 
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @Column('date')
  paymentDate!: Date;

  @Column({ type: 'varchar' })
  paymentMethod!: string;

  @Column({ type: 'varchar', nullable: true })
  reference?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}