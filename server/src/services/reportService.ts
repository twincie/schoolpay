import { PaymentRepository } from '../repositories/paymentRepository';
import * as XLSX from 'xlsx';

export class ReportService {
  static async generatePaymentReport(filters: any = {}) {
    const payments = await PaymentRepository.findAll(filters);
    
    // Format data for report
    return payments.map(payment => ({
      id: payment.id,
      payment_date: payment.paymentDate,
      student_id: payment.student.studentId,
      first_name: payment.student.firstName,
      last_name: payment.student.lastName,
      class: payment.student.class,
      category_name: payment.category.name,
      amount: payment.amount,
      payment_method: payment.paymentMethod,
      reference: payment.reference,
      notes: payment.notes
    }));
  }

  static generateExcel(data: any[]) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  static async processExcelUpload(buffer: Buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(worksheet);
  }
}