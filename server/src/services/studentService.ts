import { StudentRepository } from '../repositories/studentRepository';
import { CategoryRepository } from '../repositories/categoryRepository';
import { AppDataSource } from '../config/typeorm';

export class StudentService {
  static async getAllStudents() {
    console.log('Fetching all students from the database...');
    const students = await StudentRepository.findAll();

    console.log('Fetched students:', students.length);
    
    // Calculate total paid for each student
    return students.map(student => {
      const totalPaid = student.payments?.reduce((sum, payment) => 
        sum + parseFloat(payment.amount.toString()), 0) || 0;
      
      const categoryNames = student.categories?.map(cat => cat.name) || [];
      
      return {
        ...student,
        total_paid: totalPaid,
        category_names: categoryNames
      };
    });
  }

  static async getStudentById(id: string) {
    const studentId = parseInt(id);
    if (isNaN(studentId)) {
      throw new Error('Invalid student ID');
    }
    return await StudentRepository.findById(studentId);
  }

  static async createStudent(data: any) {
    if (!data.firstName || !data.lastName || !data.studentId || !data.class) {
      throw new Error('First name, last name, student ID, and class are required');
    }

    // Check if student ID already exists
    const existingStudents = await StudentRepository.findAll();
    const idExists = existingStudents.some(student => 
      student.studentId === data.studentId
    );
    
    if (idExists) {
      throw new Error('Student with this ID already exists');
    }

    // Handle categories
    let categories: any[] = [];
    if (data.categories && data.categories.length > 0) {
      const categoryPromises = data.categories.map(async (catId: number) => {
        const category = await CategoryRepository.findById(catId);
        if (!category) throw new Error(`Category with ID ${catId} not found`);
        return category;
      });
      categories = await Promise.all(categoryPromises);
    }

    const studentData = {
      firstName: data.firstName,
      lastName: data.lastName,
      studentId: data.studentId,
      class: data.class,
      email: data.email,
      phone: data.phone,
      categories
    };

    return await StudentRepository.create(studentData);
  }

  static async updateStudent(id: string, data: any) {
    const studentId = parseInt(id);
    if (isNaN(studentId)) {
      throw new Error('Invalid student ID');
    }

    if (!data.firstName && !data.lastName && !data.studentId && 
        !data.class && !data.email && !data.phone && !data.categories) {
      throw new Error('At least one field to update is required');
    }

    // Update student basic info
    const updateData: any = {};
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.studentId) updateData.studentId = data.studentId;
    if (data.class) updateData.class = data.class;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;

    if (Object.keys(updateData).length > 0) {
      await StudentRepository.update(studentId, updateData);
    }

    // Update categories if provided
    if (data.categories !== undefined) {
      await StudentRepository.removeAllCategories(studentId);
      
      if (data.categories && data.categories.length > 0) {
        for (const categoryId of data.categories) {
          await StudentRepository.addCategory(studentId, categoryId);
        }
      }
    }

    return await StudentRepository.findById(studentId);
  }

  static async deleteStudent(id: string) {
    const studentId = parseInt(id);
    if (isNaN(studentId)) {
      throw new Error('Invalid student ID');
    }
    return await StudentRepository.delete(studentId);
  }
}