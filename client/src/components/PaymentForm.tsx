import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import api from '../lib/axios';

const paymentSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  onCancel: () => void;
  initialData?: Partial<PaymentFormData>;
  isEditing?: boolean;
  isSaving?: boolean;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
}

interface Category {
  id: string;
  name: string;
  amount: number;
  isActive: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  isSaving = false
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      ...initialData,
      paymentDate: initialData?.paymentDate || format(new Date(), 'yyyy-MM-dd'),
      amount: initialData?.amount || 0,
      studentId: initialData?.studentId || '',
      categoryId: initialData?.categoryId || ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch students
      try {
        setLoadingStudents(true);
        const studentsResponse = await api.get('/students');
        const studentsData = studentsResponse.data.data || studentsResponse.data || [];
        setStudents(studentsData);
        console.log('Students loaded:', studentsData.length);
      } catch (error) {
        console.error('Failed to load students:', error);
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
      
      // Fetch categories
      try {
        setLoadingCategories(true);
        const categoriesResponse = await api.get('/categories/active');
        const categoriesData = categoriesResponse.data.data || categoriesResponse.data || [];
        setCategories(categoriesData);
        console.log('Categories loaded:', categoriesData.length);
      } catch (error) {
        console.error('Failed to load categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEditing ? 'Edit Payment' : 'Record New Payment'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-slate-700 mb-1">
                Student
              </label>
              {loadingStudents ? (
                <div className="text-slate-500 text-sm">Loading students...</div>
              ) : students.length === 0 ? (
                <div className="text-slate-500 text-sm">No students available</div>
              ) : (
                <select
                  {...register('studentId')}
                  id="studentId"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  disabled={isSaving}
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} ({student.studentId})
                    </option>
                  ))}
                </select>
              )}
              {errors.studentId && (
                <p className="text-sm text-red-600 mt-1">{errors.studentId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              {loadingCategories ? (
                <div className="text-slate-500 text-sm">Loading categories...</div>
              ) : categories.length === 0 ? (
                <div className="text-slate-500 text-sm">No categories available</div>
              ) : (
                <select
                  {...register('categoryId')}
                  id="categoryId"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  disabled={isSaving}
                >
                  <option value="">Select Category</option>
                  {categories
                    .filter(category => category.isActive)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name} (₦{category.amount.toLocaleString()})
                      </option>
                    ))}
                </select>
              )}
              {errors.categoryId && (
                <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
                Amount (₦)
              </label>
              <input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                id="amount"
                step="0.01"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="0.00"
                disabled={isSaving}
              />
              {errors.amount && (
                <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="paymentDate" className="block text-sm font-medium text-slate-700 mb-1">
                Payment Date
              </label>
              <input
                {...register('paymentDate')}
                type="date"
                id="paymentDate"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                disabled={isSaving}
              />
              {errors.paymentDate && (
                <p className="text-sm text-red-600 mt-1">{errors.paymentDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                {...register('paymentMethod')}
                id="paymentMethod"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                disabled={isSaving}
              >
                <option value="">Select Method</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="card">Card Payment</option>
                <option value="cheque">Cheque</option>
              </select>
              {errors.paymentMethod && (
                <p className="text-sm text-red-600 mt-1">{errors.paymentMethod.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-slate-700 mb-1">
                Reference (Optional)
              </label>
              <input
                {...register('reference')}
                type="text"
                id="reference"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Transaction reference"
                disabled={isSaving}
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              id="notes"
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Additional notes about this payment"
              disabled={isSaving}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSaving || loadingStudents || loadingCategories}
              className="flex-1 bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : isEditing ? 'Update Payment' : 'Record Payment'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;