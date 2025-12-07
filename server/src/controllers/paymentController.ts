import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { successResponse, errorResponse } from '../utils/response';

export const getPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = {
      dateFrom: req.query.dateFrom as string,
      dateTo: req.query.dateTo as string,
      studentId: req.query.studentId as string,
      categoryId: req.query.categoryId as string
    };
    const payments = await PaymentService.getAllPayments(filters);
    successResponse(res, 'Payments retrieved successfully', payments);
  } catch (error) {
    console.error('Error retrieving payments:', error);
    errorResponse(res, (error as Error).message || 'Failed to retrieve payments');
  }
};

export const createPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const paymentData = req.body;
    const payment = await PaymentService.createPayment(paymentData);
    successResponse(res, 'Payment recorded successfully', payment, 201);
  } catch (error) {
    console.error('Error creating payment:', error);
    errorResponse(res, (error as Error).message || 'Failed to record payment');
  }
};

export const updatePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const paymentData = req.body;
    const payment = await PaymentService.updatePayment(id, paymentData);
    if (!payment) {
      return errorResponse(res, 'Payment not found', 404);
    }
    successResponse(res, 'Payment updated successfully', payment);
  } catch (error) {
    console.error('Error updating payment:', error);
    errorResponse(res, (error as Error).message || 'Failed to update payment');
  }
};

export const deletePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const payment = await PaymentService.deletePayment(id);
    if (!payment) {
      return errorResponse(res, 'Payment not found', 404);
    }
    successResponse(res, 'Payment deleted successfully');
  } catch (error) {
    console.error('Error deleting payment:', error);
    errorResponse(res, (error as Error).message || 'Failed to delete payment');
  }
};