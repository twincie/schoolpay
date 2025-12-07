import { AppDataSource } from '../config/typeorm';
import { Payment } from '../entities/Payment';
import { Student } from '../entities/Student';
import { Category } from '../entities/Category';
import { Between, FindOptionsWhere } from 'typeorm';

export class PaymentRepository {
  private static repository = AppDataSource.getRepository(Payment);

  static async findAll(filters: any = {}): Promise<Payment[]> {
    const where: FindOptionsWhere<Payment> = {};
    
    if (filters.dateFrom || filters.dateTo) {
      where.paymentDate = Between(
        filters.dateFrom || '1900-01-01',
        filters.dateTo || new Date().toISOString().split('T')[0]
      );
    }
    
    if (filters.studentId) {
      where.student = { id: parseInt(filters.studentId) };
    }
    
    if (filters.categoryId) {
      where.category = { id: parseInt(filters.categoryId) };
    }

    return await this.repository.find({
      where,
      relations: ['student', 'category'],
      order: { paymentDate: 'DESC' }
    });
  }

  static async findById(id: number): Promise<Payment | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['student', 'category']
    });
  }

  static async create(data: {
    studentId: number;
    categoryId: number;
    amount: number;
    paymentDate: Date;
    paymentMethod: string;
    reference?: string;
    notes?: string;
  }): Promise<Payment> {
    // Verify student exists
    const studentRepository = AppDataSource.getRepository(Student);
    const student = await studentRepository.findOneBy({ id: data.studentId });
    if (!student) throw new Error('Student not found');

    // Verify category exists
    const categoryRepository = AppDataSource.getRepository(Category);
    const category = await categoryRepository.findOneBy({ id: data.categoryId });
    if (!category) throw new Error('Category not found');

    const payment = this.repository.create({
      student,
      category,
      amount: data.amount,
      paymentDate: data.paymentDate,
      paymentMethod: data.paymentMethod,
      reference: data.reference,
      notes: data.notes
    });

    return await this.repository.save(payment);
  }

  static async update(id: number, data: Partial<{
    amount: number;
    paymentDate: Date;
    paymentMethod: string;
    reference?: string;
    notes?: string;
  }>): Promise<Payment | null> {
    const payment = await this.findById(id);
    if (!payment) return null;

    Object.assign(payment, data);
    return await this.repository.save(payment);
  }

  static async delete(id: number): Promise<Payment | null> {
    const payment = await this.findById(id);
    if (!payment) return null;

    return await this.repository.remove(payment);
  }

  static async getTotalByCategory(categoryId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.category.id = :categoryId', { categoryId })
      .getRawOne();
    
    return parseFloat(result?.total || '0');
  }

  static async getTotalByStudent(studentId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.student.id = :studentId', { studentId })
      .getRawOne();
    
    return parseFloat(result?.total || '0');
  }
}