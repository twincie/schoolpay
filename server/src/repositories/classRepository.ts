import { Class } from '../entities/Class';
import { AppDataSource } from '../config/typeorm';

export class ClassRepository {
  private static repository = AppDataSource.getRepository(Class);

  static async findAll() {
    return this.repository.find();
  }

  static async findById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  static async create(data: Partial<Class>) {
    if (!data.name) {
      throw new Error('Class name is required');
    }

    const newClass = this.repository.create(data);
    return this.repository.save(newClass);
  }

  static async update(id: number, data: Partial<Class>) {
    if (!id) {
      throw new Error('Class ID is required');
    }

    const existingClass = await this.findById(id);
    if (!existingClass) {
      throw new Error('Class not found');
    }

    return this.repository.save({ ...existingClass, ...data });
  }

  static async delete(id: number) {
    const result = await this.repository.delete(id);
    return result.affected || 0;
  }

  static async toggleStatus(id: number) {
    const existingClass = await this.findById(id);
    if (!existingClass) {
      throw new Error('Class not found');
    }

    return this.repository.save({
      ...existingClass,
      isActive: !existingClass.isActive
    });
  }
}