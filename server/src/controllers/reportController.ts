import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';
import { PaymentService } from '../services/paymentService';
// import { StudentService } from '../services/studentService';
// import { CategoryService } from '../services/categoryService';
import { successResponse, errorResponse } from '../utils/response';
import { AppDataSource } from '../config/typeorm';
import { Student } from '../entities/Student';
import { Category } from '../entities/Category';

export const generateReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dateFrom, dateTo, categoryId, class: studentClass } = req.query;
    
    const filters: any = {};
    if (dateFrom) filters.dateFrom = dateFrom as string;
    if (dateTo) filters.dateTo = dateTo as string;
    if (categoryId) filters.categoryId = categoryId as string;
    
    // Handle class filter separately
    let payments = await ReportService.generatePaymentReport(filters);
    
    if (studentClass) {
      payments = payments.filter(payment => payment.class === studentClass);
    }
    
    // Generate Excel file
    const buffer = ReportService.generateExcel(payments);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=payments_report.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating report:', error);
    errorResponse(res, 'Failed to generate report');
  }
};

export const uploadPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const data = await ReportService.processExcelUpload(req.file.buffer);
    
    const studentRepository = AppDataSource.getRepository(Student);
    const categoryRepository = AppDataSource.getRepository(Category);
    
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const [index, row] of (data as any[]).entries()) {
      try {
        const { studentId, categoryName, amount, paymentDate, paymentMethod, reference } = row;
        
        // Find student
        const student = await studentRepository.findOne({ 
          where: { studentId: studentId.toString() } 
        });
        
        // Find category
        const category = await categoryRepository.findOne({ 
          where: { name: categoryName } 
        });
        
        if (!student) {
          throw new Error(`Student with ID ${studentId} not found`);
        }
        
        if (!category) {
          throw new Error(`Category "${categoryName}" not found`);
        }

        // Create payment
        await PaymentService.createPayment({
          studentId: student.id,
          categoryId: category.id,
          amount: parseFloat(amount),
          paymentDate: new Date(paymentDate),
          paymentMethod: paymentMethod || 'Cash',
          reference: reference
        });
        
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Row ${index + 1}: ${(error as Error).message}`);
      }
    }

    successResponse(res, `Upload completed. ${successCount} payments imported, ${errorCount} errors.`, { errors });
  } catch (error) {
    console.error('Error processing upload:', error);
    errorResponse(res, 'Failed to process uploaded file');
  }
};