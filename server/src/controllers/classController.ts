import { Request, Response } from 'express';
import { ClassService } from '../services/classService';
import { successResponse, errorResponse } from '../utils/response';

export const getClasses = async (req: Request, res: Response): Promise<void> => {
  try {
    const classes = await ClassService.getAllClasses();
    successResponse(res, 'Classes retrieved successfully', classes);
  } catch (error) {
    console.error('Error retrieving classes:', error);
    errorResponse(res, (error as Error).message || 'Failed to retrieve classes');
  }
};

export const createClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const classData = req.body;
    const newClass = await ClassService.createClass(classData);
    successResponse(res, 'Class created successfully', newClass, 201);
  } catch (error) {
    console.error('Error creating class:', error);
    errorResponse(res, (error as Error).message || 'Failed to create class');
  }
};

export const updateClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const classData = req.body;
    const updatedClass = await ClassService.updateClass(Number(id), classData);
    if (!updatedClass) {
      return errorResponse(res, 'Class not found', 404);
    }
    successResponse(res, 'Class updated successfully', updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    errorResponse(res, (error as Error).message || 'Failed to update class');
  }
};

export const deleteClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await ClassService.deleteClass(Number(id));
    if (result === 0) {
      return errorResponse(res, 'Class not found', 404);
    }
    successResponse(res, 'Class deleted successfully');
  } catch (error) {
    console.error('Error deleting class:', error);
    errorResponse(res, (error as Error).message || 'Failed to delete class');
  }
};

export const toggleClassStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedClass = await ClassService.toggleClassStatus(Number(id));
    if (!updatedClass) {
      return errorResponse(res, 'Class not found', 404);
    }
    successResponse(res, `Class ${updatedClass.isActive ? 'activated' : 'deactivated'} successfully`, updatedClass);
  } catch (error) {
    console.error('Error toggling class status:', error);
    errorResponse(res, (error as Error).message || 'Failed to toggle class status');
  }
};