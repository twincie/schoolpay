import { Request, Response } from 'express';
import { StudentService } from '../services/studentService';
import { successResponse, errorResponse } from '../utils/response';

export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const students = await StudentService.getAllStudents();
    successResponse(res, 'Students retrieved successfully', students);
  } catch (error) {
    console.error('Error retrieving students:', error);
    errorResponse(res, (error as Error).message || 'Failed to retrieve students');
  }
};

export const createStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentData = req.body;
    const student = await StudentService.createStudent(studentData);
    successResponse(res, 'Student created successfully', student, 201);
  } catch (error) {
    console.error('Error creating student:', error);
    errorResponse(res, (error as Error).message || 'Failed to create student');
  }
};

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const studentData = req.body;
    const student = await StudentService.updateStudent(id, studentData);
    if (!student) {
      return errorResponse(res, 'Student not found', 404);
    }
    successResponse(res, 'Student updated successfully', student);
  } catch (error) {
    console.error('Error updating student:', error);
    errorResponse(res, (error as Error).message || 'Failed to update student');
  }
};

export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const student = await StudentService.deleteStudent(id);
    if (!student) {
      return errorResponse(res, 'Student not found', 404);
    }
    successResponse(res, 'Student deleted successfully');
  } catch (error) {
    console.error('Error deleting student:', error);
    errorResponse(res, (error as Error).message || 'Failed to delete student');
  }
};