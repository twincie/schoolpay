import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DashboardCard from '../components/DashboardCard';
import PaymentChart from '../components/PaymentChart';
import { Users, DollarSign, CreditCard, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import api from '../lib/axios';

interface DashboardStats {
  totalStudents: number;
  totalExpected: number;
  totalCollected: number;
  outstanding: number;
}

interface RecentPayment {
  id: string;
  student: string;
  amount: number;
  category: string;
  date: string;
}

interface PaymentStatus {
  fullyPaid: number;
  partiallyPaid: number;
  notPaid: number;
}

interface TopCategory {
  name: string;
  amount: number;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalExpected: 0,
    totalCollected: 0,
    outstanding: 0
  });
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    fullyPaid: 0,
    partiallyPaid: 0,
    notPaid: 0
  });
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [studentsRes, paymentsRes] = await Promise.all([
        api.get('/students'),
        api.get('/payments')
      ]);
      
      console.log('Dashboard data loaded:', {
        students: studentsRes.data.data?.length,
        payments: paymentsRes.data.data?.length
      });
      
      // Process students data
      const students = studentsRes.data.data || [];
      const payments = paymentsRes.data.data || [];
      
      // Calculate statistics
      calculateStats(students, payments);
      
      // Get recent payments
      getRecentPayments(payments);
      
      // Calculate payment status
      calculatePaymentStatus(students);
      
      // Get top categories
      getTopCategories(payments);
      
      // Get monthly data for chart
      getMonthlyData(payments);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (students: any[], payments: any[]) => {
    // Calculate total students
    const totalStudents = students.length;
    
    // Calculate total expected from student categories
    const totalExpected = students.reduce((sum, student) => {
      const studentExpected = student.categories?.reduce((catSum: number, cat: any) => 
        catSum + parseFloat(cat.amount.toString()), 0) || 0;
      return sum + studentExpected;
    }, 0);
    
    // Calculate total collected from payments
    const totalCollected = payments.reduce((sum, payment) => 
      sum + parseFloat(payment.amount.toString()), 0);
    
    // Calculate outstanding
    const outstanding = totalExpected - totalCollected;
    
    setStats({
      totalStudents,
      totalExpected,
      totalCollected,
      outstanding
    });
  };

  const getRecentPayments = (payments: any[]) => {
    // Sort by date and take top 5
    const sortedPayments = [...payments]
      .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
      .slice(0, 5);
    
    const recent = sortedPayments.map(payment => ({
      id: payment.id.toString(),
      student: payment.student ? 
        `${payment.student.firstName} ${payment.student.lastName}` : 'Unknown',
      amount: parseFloat(payment.amount.toString()),
      category: payment.category?.name || 'Unknown',
      date: format(new Date(payment.payment_date), 'yyyy-MM-dd')
    }));
    
    setRecentPayments(recent);
  };

  const calculatePaymentStatus = (students: any[]) => {
    let fullyPaid = 0;
    let partiallyPaid = 0;
    let notPaid = 0;
    
    students.forEach(student => {
      const totalExpected = student.categories?.reduce((sum: number, cat: any) => 
        sum + parseFloat(cat.amount.toString()), 0) || 0;
      
      const totalPaid = student.payments?.reduce((sum: number, payment: any) => 
        sum + parseFloat(payment.amount.toString()), 0) || 0;
      
      if (totalPaid >= totalExpected) {
        fullyPaid++;
      } else if (totalPaid > 0) {
        partiallyPaid++;
      } else {
        notPaid++;
      }
    });
    
    const total = students.length;
    setPaymentStatus({
      fullyPaid: total > 0 ? Math.round((fullyPaid / total) * 100) : 0,
      partiallyPaid: total > 0 ? Math.round((partiallyPaid / total) * 100) : 0,
      notPaid: total > 0 ? Math.round((notPaid / total) * 100) : 0
    });
  };

  const getTopCategories = (payments: any[]) => {
    const categoryMap = new Map<string, number>();
    
    payments.forEach(payment => {
      const categoryName = payment.category?.name || 'Unknown';
      const amount = parseFloat(payment.amount.toString());
      
      if (categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, categoryMap.get(categoryName)! + amount);
      } else {
        categoryMap.set(categoryName, amount);
      }
    });
    
    // Convert to array, sort by amount, and take top 4
    const categories = Array.from(categoryMap.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
    
    setTopCategories(categories);
  };

  const getMonthlyData = (payments: any[]) => {
    // Group payments by month
    const monthlyMap = new Map<string, { payments: number, expected: number }>();
    
    // For now, we'll just show payments by month
    // You might need a separate endpoint for expected amounts by month
    payments.forEach(payment => {
      const date = new Date(payment.payment_date);
      const monthKey = format(date, 'MMM');
      const amount = parseFloat(payment.amount.toString());
      
      if (monthlyMap.has(monthKey)) {
        const current = monthlyMap.get(monthKey)!;
        monthlyMap.set(monthKey, { 
          payments: current.payments + amount,
          expected: current.expected // You would need expected data here
        });
      } else {
        monthlyMap.set(monthKey, { 
          payments: amount, 
          expected: amount * 1.2 // Placeholder - adjust based on your data
        });
      }
    });
    
    // Convert to array format for chart
    const monthlyData = Array.from(monthlyMap.entries())
      .map(([month, data]) => ({
        month,
        payments: data.payments,
        expected: data.expected
      }))
      .sort((a, b) => {
        // Sort by month order
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
    
    setMonthlyData(monthlyData as any);
  };

  const dashboardStats = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Total Expected',
      value: `₦${stats.totalExpected.toLocaleString()}`,
      icon: DollarSign,
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Total Collected',
      value: `₦${stats.totalCollected.toLocaleString()}`,
      icon: CreditCard,
      trend: { value: 15, isPositive: true }
    },
    {
      title: 'Outstanding',
      value: `₦${Math.max(0, stats.outstanding).toLocaleString()}`,
      icon: AlertCircle,
      trend: { value: stats.outstanding > 0 ? 5 : 0, isPositive: false }
    }
  ];

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'Add New Payment':
        window.location.href = '/payments';
        break;
      case 'Register Student':
        window.location.href = '/students';
        break;
      case 'Generate Report':
        window.location.href = '/reports';
        break;
      case 'Export Data':
        generateReport();
        break;
    }
  };

  const generateReport = async () => {
    try {
      const response = await api.get('/reports/generate', {
        responseType: 'blob' // Important for file downloads
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dashboard_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Overview of school payment activities</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-slate-500">Loading dashboard data...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardStats.map((stat, index) => (
                <DashboardCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  trend={stat.trend}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <PaymentChart data={monthlyData} />
              
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Payments</h3>
                <div className="space-y-4">
                  {recentPayments.length > 0 ? (
                    recentPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-slate-900">{payment.student}</p>
                          <p className="text-sm text-slate-600">{payment.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-900">₦{payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-slate-600">{payment.date}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-500">
                      No payments recorded yet
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Fully Paid</span>
                    <span className="text-sm font-medium text-green-600">{paymentStatus.fullyPaid}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${paymentStatus.fullyPaid}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Partially Paid</span>
                    <span className="text-sm font-medium text-yellow-600">{paymentStatus.partiallyPaid}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${paymentStatus.partiallyPaid}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Not Paid</span>
                    <span className="text-sm font-medium text-red-600">{paymentStatus.notPaid}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${paymentStatus.notPaid}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Categories</h3>
                <div className="space-y-3">
                  {topCategories.length > 0 ? (
                    topCategories.map((category, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">{category.name}</span>
                        <span className="text-sm font-medium text-slate-900">
                          ₦{(category.amount / 1000).toFixed(0)}K
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-500">
                      No category data available
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleQuickAction('Add New Payment')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    Add New Payment
                  </button>
                  <button 
                    onClick={() => handleQuickAction('Register Student')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    Register Student
                  </button>
                  <button 
                    onClick={() => handleQuickAction('Generate Report')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    Generate Report
                  </button>
                  <button 
                    onClick={() => handleQuickAction('Export Data')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;