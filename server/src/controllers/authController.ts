import { Request, Response } from 'express';
    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken';
    import { successResponse, errorResponse } from '../utils/response';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // For demo purposes, using a simple admin user
    // In production, fetch from database
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@school.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password';

    if (email !== adminEmail || password !== adminPassword) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h',
    });

    successResponse(res, 'Login successful', { token });
  } catch (error) {
    errorResponse(res, 'Login failed');
  }
};