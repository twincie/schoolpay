import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { successResponse, errorResponse } from '../utils/response';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await CategoryService.getAllCategories();
    successResponse(res, 'Categories retrieved successfully', categories);
  } catch (error) {
    console.error('Error retrieving categories:', error);
    errorResponse(res, 'Failed to retrieve categories');
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, amount, description } = req.body;
    const category = await CategoryService.createCategory({ 
      name, 
      amount: parseFloat(amount), 
      description 
    });
    successResponse(res, 'Category created successfully', category, 201);
  } catch (error) {
    console.error('Error creating category:', error);
    errorResponse(res, (error as Error).message || 'Failed to create category');
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, amount, description } = req.body;
    
    const updateData: any = {};
    if (name) updateData.name = name;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (description !== undefined) updateData.description = description;
    
    const category = await CategoryService.updateCategory(id, updateData);
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }
    successResponse(res, 'Category updated successfully', category);
  } catch (error) {
    console.error('Error updating category:', error);
    errorResponse(res, (error as Error).message || 'Failed to update category');
  }
};

export const toggleStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await CategoryService.toggleCategory(id);
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }
    successResponse(res, 'Category toggled successfully');
  } catch (error) {
    console.error('Error toggling category:', error);
    errorResponse(res, (error as Error).message || 'Failed to toggle category');
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await CategoryService.deleteCategory(id);
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }
    successResponse(res, 'Category deleted successfully');
  } catch (error) {
    console.error('Error deleting category:', error);
    errorResponse(res, (error as Error).message || 'Failed to delete category');
  }
};

export const getActiveCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await CategoryService.getActiveCategories();
    successResponse(res, 'Active categories retrieved successfully', categories);
  } catch (error) {
    console.error('Error retrieving active categories:', error);
    errorResponse(res, 'Failed to retrieve active categories');
  }
};