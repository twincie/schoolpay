import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PaymentForm from '../components/PaymentForm';
import { Plus, Edit, Trash2, Search, Filter} from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import api from '../lib/axios';

interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  student?: any;
  categoryId: string;
  categoryName: string;
  category?: any;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference?: string;
  notes?: string;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payments');
      console.log('Payments data:', res.data.data);
      
      const paymentsData = res.data.data.map((payment: any) => ({
        id: payment.id.toString(),
        studentId: payment.student?.id?.toString() || '',
        studentName: payment.student ? `${payment.student.firstName} ${payment.student.lastName}` : 'Unknown',
        student: payment.student,
        categoryId: payment.category?.id?.toString() || '',
        categoryName: payment.category?.name || 'Unknown',
        category: payment.category,
        amount: parseFloat(payment.amount.toString()),
        paymentDate: payment.payment_date,
        paymentMethod: payment.payment_method,
        reference: payment.reference,
        notes: payment.notes
      }));
      
      setPayments(paymentsData);
    } catch (err) {
      toast.error('Failed to load payments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (data: any): Promise<void> => {
    setIsSaving(true);
    return api
      .post('/payments', {
        studentId: parseInt(data.studentId),
        categoryId: parseInt(data.categoryId),
        amount: parseFloat(data.amount),
        paymentDate: data.paymentDate,
        paymentMethod: data.paymentMethod,
        reference: data.reference || null,
        notes: data.notes || null
      })
      .then(() => {
        toast.success('Payment recorded successfully');
        setShowForm(false);
        loadPayments();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to record payment');
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleEditPayment = async (data: any): Promise<void> => {
    if (!editingPayment) return;

    setIsSaving(true);
    return api
      .put(`/payments/${editingPayment.id}`, {
        studentId: parseInt(data.studentId),
        categoryId: parseInt(data.categoryId),
        amount: parseFloat(data.amount),
        paymentDate: data.paymentDate,
        paymentMethod: data.paymentMethod,
        reference: data.reference || null,
        notes: data.notes || null
      })
      .then(() => {
        toast.success('Payment updated successfully');
        setShowForm(false);
        setEditingPayment(null);
        loadPayments();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to update payment');
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleDeletePayment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this payment record?')) return;

    try {
      await api.delete(`/payments/${id}`);
      toast.success('Payment deleted successfully');
      loadPayments();
    } catch (err) {
      toast.error('Failed to delete payment');
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = !filterMethod || payment.paymentMethod === filterMethod;
    
    const paymentDate = new Date(payment.paymentDate);
    const matchesDateFrom = !dateFrom || paymentDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || paymentDate <= new Date(dateTo);
    
    return matchesSearch && matchesMethod && matchesDateFrom && matchesDateTo;
  });

  const getMethodLabel = (method: string) => {
    const methods: { [key: string]: string } = {
      cash: 'Cash',
      bank_transfer: 'Bank Transfer',
      card: 'Card Payment',
      cheque: 'Cheque'
    };
    return methods[method] || method;
  };

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
            <p className="text-slate-600 mt-1">Track and manage student payment records</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Record Payment</span>
          </button>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              <option value="">All Methods</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card Payment</option>
              <option value="cheque">Cheque</option>
            </select>
            
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="From date"
            />
            
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="To date"
            />
            
            <div className="flex flex-col justify-center">
              <div className="text-sm text-slate-600">
                <Filter className="h-4 w-4 inline mr-1" />
                {filteredPayments.length} payments
              </div>
              <div className="text-sm font-medium text-slate-900">
                Total: ₦{totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-slate-500">Loading payments...</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {format(new Date(payment.paymentDate), 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{payment.studentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{payment.categoryName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          ₦{payment.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">
                          {getMethodLabel(payment.paymentMethod)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{payment.reference || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingPayment(payment);
                              setShowForm(true);
                            }}
                            className="text-slate-600 hover:text-slate-900 p-1 rounded-md hover:bg-slate-100 transition-colors"
                            aria-label="Edit payment"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePayment(payment.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                            aria-label="Delete payment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-500 mb-4">
              {payments.length === 0 ? 'No payments recorded yet' : 'No payments match your filters'}
            </div>
            {payments.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              >
                Record Your First Payment
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />

      {showForm && (
        <PaymentForm
          onSubmit={editingPayment ? handleEditPayment : handleAddPayment}
          onCancel={() => {
            setShowForm(false);
            setEditingPayment(null);
          }}
          initialData={editingPayment || undefined}
          isEditing={!!editingPayment}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default Payments;