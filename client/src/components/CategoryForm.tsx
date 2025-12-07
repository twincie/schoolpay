import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => Promise<void>; // ← now async
  onCancel: () => void;
  initialData?: Partial<CategoryFormData>;
  isEditing?: boolean;
  isLoading?: boolean; // ← new optional prop
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
   isEditing = false,
  isLoading = false, // ← defaults to false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData,
  });

   // Combine internal submitting state + external loading state
  const isFormBusy = isSubmitting || isLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEditing ? 'Edit Category' : 'Add New Category'}
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
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Category Name
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="e.g., SS1 School Fees"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

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
            />
            {errors.amount && (
              <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Additional details about this category"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isFormBusy}
              className="flex-1 bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isFormBusy ? 'Saving...' : isEditing ? 'Update Category' : 'Add Category'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;