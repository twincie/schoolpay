import { CategoryRepository } from '../repositories/categoryRepository';

export class CategoryService {
  static async getAllCategories() {
    return await CategoryRepository.findAll();
  }

  static async getCategoryById(id: string) {
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      throw new Error('Invalid category ID');
    }
    return await CategoryRepository.findById(categoryId);
  }

  static async createCategory(data: {
    name: string;
    amount: number;
    description?: string;
  }) {
    if (!data.name || data.amount === undefined) {
      throw new Error('Name and amount are required');
    }

    // Check if category name already exists
    const existing = await CategoryRepository.findAll();
    const nameExists = existing.some(cat => 
      cat.name.toLowerCase() === data.name.toLowerCase()
    );
    
    if (nameExists) {
      throw new Error('Category with this name already exists');
    }

    return await CategoryRepository.create(data);
  }

  static async updateCategory(id: string, data: Partial<{
    name: string;
    amount: number;
    description?: string;
  }>) {
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      throw new Error('Invalid category ID');
    }

    if (!data.name && data.amount === undefined && !data.description) {
      throw new Error('At least one field to update is required');
    }

    return await CategoryRepository.update(categoryId, data);
  }

  static async toggleCategory(id: string) {
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      throw new Error('Invalid category ID');
    }
    return await CategoryRepository.toggleStatus(categoryId);
  }

  static async deleteCategory(id: string) {
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      throw new Error('Invalid category ID');
    }
    return await CategoryRepository.delete(categoryId);
  }

   static async getActiveCategories() {
    return await CategoryRepository.findActive();
  }
}