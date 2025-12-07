import { ClassRepository } from '../repositories/classRepository';

export class ClassService {
  static async getAllClasses() {
    return ClassRepository.findAll();
  }

  static async getClassById(id: number) {
    return ClassRepository.findById(id);
  }

  static async createClass(data: any) {
    return ClassRepository.create(data);
  }

  static async updateClass(id: number, data: any) {
    return ClassRepository.update(id, data);
  }

  static async deleteClass(id: number) {
    return ClassRepository.delete(id);
  }

  static async toggleClassStatus(id: number) {
    return ClassRepository.toggleStatus(id);
  }
}