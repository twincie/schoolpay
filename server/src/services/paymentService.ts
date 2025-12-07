import { PaymentRepository } from '../repositories/paymentRepository';

export class PaymentService {
  static async getAllPayments(filters: any = {}) {
    const payments = await PaymentRepository.findAll(filters);
    
    // Format the response to include student and category names
    return payments.map(payment => ({
      id: payment.id,
      student_id: payment.student.id,
      category_id: payment.category.id,
      amount: payment.amount,
      payment_date: payment.paymentDate,
      payment_method: payment.paymentMethod,
      reference: payment.reference,
      notes: payment.notes,
      created_at: payment.createdAt,
      updated_at: payment.updatedAt,
      first_name: payment.student.firstName,
      last_name: payment.student.lastName,
      category_name: payment.category.name,
      student: {
        id: payment.student.id,
        firstName: payment.student.firstName,
        lastName: payment.student.lastName,
        studentId: payment.student.studentId,
        class: payment.student.class
      },
      category: {
        id: payment.category.id,
        name: payment.category.name,
        amount: payment.category.amount
      }
    }));
  }

  static async getPaymentById(id: string) {
    const paymentId = parseInt(id);
    if (isNaN(paymentId)) {
      throw new Error('Invalid payment ID');
    }
    return await PaymentRepository.findById(paymentId);
  }

  static async createPayment(data: any) {
    if (!data.studentId || !data.categoryId || 
        data.amount === undefined || !data.paymentDate || !data.paymentMethod) {
      throw new Error('Student ID, category ID, amount, payment date, and payment method are required');
    }

    const paymentData = {
      studentId: parseInt(data.studentId),
      categoryId: parseInt(data.categoryId),
      amount: parseFloat(data.amount),
      paymentDate: new Date(data.paymentDate),
      paymentMethod: data.paymentMethod,
      reference: data.reference,
      notes: data.notes
    };

    return await PaymentRepository.create(paymentData);
  }

  static async updatePayment(id: string, data: any) {
    const paymentId = parseInt(id);
    if (isNaN(paymentId)) {
      throw new Error('Invalid payment ID');
    }

    if (data.amount === undefined && !data.paymentDate && 
        !data.paymentMethod && !data.reference && !data.notes) {
      throw new Error('At least one field to update is required');
    }

    const updateData: any = {};
    if (data.amount !== undefined) updateData.amount = parseFloat(data.amount);
    if (data.paymentDate) updateData.paymentDate = new Date(data.paymentDate);
    if (data.paymentMethod) updateData.paymentMethod = data.paymentMethod;
    if (data.reference !== undefined) updateData.reference = data.reference;
    if (data.notes !== undefined) updateData.notes = data.notes;

    return await PaymentRepository.update(paymentId, updateData);
  }

  static async deletePayment(id: string) {
    const paymentId = parseInt(id);
    if (isNaN(paymentId)) {
      throw new Error('Invalid payment ID');
    }
    return await PaymentRepository.delete(paymentId);
  }
}