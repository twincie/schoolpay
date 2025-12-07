import { AppDataSource } from '../config/typeorm';
import { Category } from '../entities/Category';
import { Student } from '../entities/Student';

export class CategoryRepository {
  private static repository = AppDataSource.getRepository(Category);

  static async findAll(): Promise<Category[]> {
    return await this.repository.find({
      where: { isDeleted: false },
      order: { name: 'ASC' }
    });
  }

  static async findById(id: number): Promise<Category | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['payments']
    });
  }

  static async create(data: {
    name: string;
    amount: number;
    description?: string;
  }): Promise<Category> {
    const category = this.repository.create(data);
    return await this.repository.save(category);
  }

  static async update(id: number, data: Partial<{
    name: string;
    amount: number;
    description?: string;
  }>): Promise<Category | null> {
    const category = await this.findById(id);
    if (!category) return null;

    Object.assign(category, data);
    return await this.repository.save(category);
  }

  static async toggleStatus(id: number): Promise<Category | null> {
    const category = await this.findById(id);
    if (!category) return null;

    // Toggle the isActive status
    category.isActive = !category.isActive;
    return await this.repository.save(category);
  }


  static async delete(id: number): Promise<Category | null> {
    const category = await this.findById(id);
    if (!category) return null;

    // Soft delete
    category.isDeleted = true;
    return await this.repository.save(category);
  }

  static async getStudents(id: number): Promise<Student[]> {
    const category = await this.repository.findOne({
      where: { id },
      relations: ['students']
    });
    
    return category?.students || [];
  }

  // Add this method to get only active categories
  static async findActive(): Promise<Category[]> {
    return await this.repository.find({
      where: { isActive: true, isDeleted: false },
      order: { name: 'ASC' }
    });
  }
}