import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import api from '../lib/axios';

const studentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  class: z.string().min(1, 'Class is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  categories: z.array(z.string()).min(1, 'At least one category must be selected'),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  initialData?: Partial<StudentFormData>;
  isEditing?: boolean;
  isSaving?: boolean;
}

interface Category {
  id: string;
  name: string;
  amount: number;
  isActive: boolean;
}

interface Class {
  id: string;
  name: string;
  description?: string;
}

const StudentForm: React.FC<StudentFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  isSaving = false
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid }
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      ...initialData,
      categories: initialData?.categories || [],
      email: initialData?.email || '',
      phone: initialData?.phone || ''
    },
    mode: 'onChange'
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories
      try {
        const categoriesResponse = await api.get('/categories/active');
        const categoriesData = categoriesResponse.data.data || categoriesResponse.data || [];
        // Ensure IDs are strings
        const categoriesWithStringIds = categoriesData.map((cat: Category) => ({
          ...cat,
          id: cat.id.toString()
        }));
        setCategories(categoriesWithStringIds);
        console.log('Categories loaded:', categoriesWithStringIds);
      } catch (error) {
        console.error('Failed to load categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
      
      // Fetch classes
      try {
        const classesResponse = await api.get('/classes');
        const classesData = classesResponse.data.data || classesResponse.data || [];
        setClasses(classesData);
        console.log('Classes loaded:', classesData);
      } catch (error) {
        console.error('Failed to load classes:', error);
        setClasses([]);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchData();
  }, []);

  const selectedCategories = watch('categories');

  const totalAmount = categories
    .filter(cat => selectedCategories?.includes(cat.id.toString()) && cat.isActive)
    .reduce((sum: number, cat: any) => 
          sum + parseFloat(cat.amount), 0) || 0;
        

  // Handle form submission with logging
  const handleFormSubmit = (data: StudentFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Form is valid:', isValid);
    console.log('Form errors:', errors);
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEditing ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            aria-label="Close"
            type="button"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                First Name
              </label>
              <input
                {...register('firstName')}
                type="text"
                id="firstName"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                disabled={isSaving}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                Last Name
              </label>
              <input
                {...register('lastName')}
                type="text"
                id="lastName"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                disabled={isSaving}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-slate-700 mb-1">
                Student ID
              </label>
              <input
                {...register('studentId')}
                type="text"
                id="studentId"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                disabled={isSaving}
              />
              {errors.studentId && (
                <p className="text-sm text-red-600 mt-1">{errors.studentId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="class" className="block text-sm font-medium text-slate-700 mb-1">
                Class
              </label>
              {loadingClasses ? (
                <div className="text-slate-500 text-sm">Loading classes...</div>
              ) : classes.length === 0 ? (
                <div className="text-slate-500 text-sm">No classes available</div>
              ) : (
                <select
                  {...register('class')}
                  id="class"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  disabled={isSaving}
                >
                  <option value="">Select Class</option>
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.name}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.class && (
                <p className="text-sm text-red-600 mt-1">{errors.class.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email (Optional)
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                disabled={isSaving}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                Phone (Optional)
              </label>
              <input
                {...register('phone')}
                type="tel"
                id="phone"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                disabled={isSaving}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment Categories *
            </label>
            
            {loadingCategories ? (
              <div className="text-center py-4 text-slate-500">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-4 text-slate-500">
                No categories available. Please add categories first.
              </div>
            ) : (
              <>
                {/* Use Controller for checkboxes array with category IDs as strings */}
                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-slate-300 rounded-md p-3 mb-2">
                      {categories
                        .filter(category => category.isActive !== false)
                        .map((category) => (
                          <label key={category.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={field.value?.includes(category.id) || false}
                                onChange={(e) => {
                                  const currentValue = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([...currentValue, category.id]);
                                  } else {
                                    field.onChange(currentValue.filter((id: string) => id !== category.id));
                                  }
                                }}
                                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                                disabled={isSaving}
                              />
                              <span className="ml-2 text-sm text-slate-700">{category.name}</span>
                            </div>
                            <span className="text-sm font-medium text-slate-900">
                              ₦{category.amount.toLocaleString()}
                            </span>
                          </label>
                        ))}
                    </div>
                  )}
                />
                
                {selectedCategories?.length > 0 && (
                  <div className="text-right text-sm font-medium text-slate-900">
                    Total: ₦{totalAmount.toLocaleString()}
                  </div>
                )}
                
                {errors.categories && (
                  <p className="text-sm text-red-600 mt-1">{errors.categories.message}</p>
                )}
              </>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : isEditing ? 'Update Student' : 'Add Student'}
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

export default StudentForm;