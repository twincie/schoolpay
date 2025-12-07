import { AppDataSource } from '../config/typeorm';
import { Student } from '../entities/Student';
import { Category } from '../entities/Category';

export class StudentRepository {
  private static repository = AppDataSource.getRepository(Student);

  static async findAll(): Promise<Student[]> {
    return await this.repository.find({
      relations: ['categories', 'payments'],
      order: { firstName: 'ASC', lastName: 'ASC' }
    });
  }

  static async findById(id: number): Promise<Student | null> {
    return await this.repository.findOne({
      where: { id },
      // relations: ['categories', 'payments']
    });
  }

  static async create(data: {
    firstName: string;
    lastName: string;
    studentId: string;
    class: string;
    email?: string;
    phone?: string;
    categories?: Category[];
  }): Promise<Student> {
    const student = this.repository.create(data);
    return await this.repository.save(student);
  }

  static async update(id: number, data: Partial<{
    firstName: string;
    lastName: string;
    studentId: string;
    class: string;
    email?: string;
    phone?: string;
  }>): Promise<Student | null> {
    const student = await this.findById(id);
    if (!student) return null;

    Object.assign(student, data);
    return await this.repository.save(student);
  }

  static async delete(id: number): Promise<Student | null> {
    const student = await this.findById(id);
    if (!student) return null;

    return await this.repository.remove(student);
  }

  static async addCategory(studentId: number, categoryId: number): Promise<Student | null> {
    const student = await this.repository.findOne({
      where: { id: studentId },
      relations: ['categories']
    });
    
    const categoryRepository = AppDataSource.getRepository(Category);
    const category = await categoryRepository.findOneBy({ id: categoryId });
    
    if (student && category) {
      if (!student.categories) {
        student.categories = [];
      }
      
      // Check if category already exists
      const existingCategory = student.categories.find(c => c.id === categoryId);
      if (!existingCategory) {
        student.categories.push(category);
        return await this.repository.save(student);
      }
      
      return student;
    }
    
    return null;
  }

  static async removeAllCategories(studentId: number): Promise<void> {
    const student = await this.repository.findOne({
      where: { id: studentId },
      relations: ['categories']
    });
    
    if (student) {
      student.categories = [];
      await this.repository.save(student);
    }
  }
}