export interface Category {
  id: string;
  name: string;
  amount: number;
  description?: string;
  isActive: boolean;
  studentsCount: number;
  totalCollected: number;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  class: string;
  email?: string;
  phone?: string;
  categories: string[];
  totalExpected: number;
  totalPaid: number;
  paymentStatus: 'Fully Paid' | 'Partially Paid' | 'Not Paid';
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference?: string;
  notes?: string;
}

export interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}