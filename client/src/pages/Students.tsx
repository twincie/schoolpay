import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudentForm from '../components/StudentForm';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../lib/axios';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  class: string;
  email?: string;
  phone?: string;
  categories: string[]; // Array of category IDs
  totalExpected: number;
  totalPaid: number;
  paymentStatus: 'Fully Paid' | 'Partially Paid' | 'Not Paid';
  createdAt?: string;
  updatedAt?: string;
}

interface Class {
  id: string;
  name: string;
  description?: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students');
      console.log('Students data:', res.data.data);
      
      const studentsData = res.data.data.map((student: any) => {
        // Calculate totalExpected - convert amounts to numbers
        const totalExpected = student.categories?.reduce((sum: number, cat: any) => 
          sum + parseFloat(cat.amount), 0) || 0;
        
        // Calculate totalPaid - convert amounts to numbers
        const totalPaid = student.payments?.reduce((sum: number, payment: any) => 
          sum + parseFloat(payment.amount), 0) || 0;

        return {
          id: student.id.toString(),
          firstName: student.firstName,
          lastName: student.lastName,
          studentId: student.studentId,
          class: student.class,
          email: student.email || '',
          phone: student.phone || '',
          categories: student.categories?.map((cat: any) => cat.id.toString()) || [],
          totalExpected: totalExpected,
          totalPaid: totalPaid,
          paymentStatus: calculatePaymentStatus(student, totalExpected, totalPaid),
          createdAt: student.createdAt,
          updatedAt: student.updatedAt
        };
      });
      setStudents(studentsData);
    } catch (err) {
      toast.error('Failed to load students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      const res = await api.get('/classes');
      setClasses(res.data.data || res.data);
    } catch (err) {
      console.error('Failed to load classes:', err);
    }
  };

  const calculatePaymentStatus = (
  student: any, 
  totalExpected: number = 0, 
  totalPaid: number = 0
): 'Fully Paid' | 'Partially Paid' | 'Not Paid' => {
  // Use passed values or calculate fresh
  const expected = totalExpected || student.categories?.reduce((sum: number, cat: any) => 
    sum + parseFloat(cat.amount), 0) || 0;
  
  const paid = totalPaid || student.payments?.reduce((sum: number, payment: any) => 
    sum + parseFloat(payment.amount), 0) || 0;
  
  if (paid >= expected) return 'Fully Paid';
  if (paid > 0) return 'Partially Paid';
  return 'Not Paid';
};

  const handleAddStudent = async (data: any): Promise<void> => {
    setIsSaving(true);
    return api
      .post('/students', {
        firstName: data.firstName,
        lastName: data.lastName,
        studentId: data.studentId,
        class: data.class,
        email: data.email || null,
        phone: data.phone || null,
        categories: data.categories.map((id: string) => parseInt(id))
      })
      .then(() => {
        toast.success('Student added successfully');
        setShowForm(false);
        loadStudents();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to add student');
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleEditStudent = async (data: any): Promise<void> => {
    if (!editingStudent) return;

    setIsSaving(true);
    return api
      .put(`/students/${editingStudent.id}`, {
        firstName: data.firstName,
        lastName: data.lastName,
        studentId: data.studentId,
        class: data.class,
        email: data.email || null,
        phone: data.phone || null,
        categories: data.categories.map((id: string) => parseInt(id))
      })
      .then(() => {
        toast.success('Student updated successfully');
        setShowForm(false);
        setEditingStudent(null);
        loadStudents();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to update student');
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted');
      loadStudents();
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = !filterClass || student.class === filterClass;
    const matchesStatus = !filterStatus || student.paymentStatus === filterStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Fully Paid':
        return 'bg-green-100 text-green-800';
      case 'Partially Paid':
        return 'bg-yellow-100 text-yellow-800';
      case 'Not Paid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Students</h1>
            <p className="text-slate-600 mt-1">Manage student records and payment tracking</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              <option value="">All Classes</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.name}>
                  {classItem.name}
                </option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Fully Paid">Fully Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Not Paid">Not Paid</option>
            </select>
            
            <div className="flex items-center text-sm text-slate-600">
              <Filter className="h-4 w-4 mr-2" />
              {filteredStudents.length} of {students.length} students
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-slate-500">Loading students...</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredStudents.map((student) => {
                    const balance = student.totalExpected - student.totalPaid;
                    return (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-slate-500">{student.studentId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{student.class}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{student.email || 'N/A'}</div>
                          <div className="text-sm text-slate-500">{student.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.paymentStatus)}`}>
                            {student.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">
                            ₦{student.totalPaid.toLocaleString()} / ₦{student.totalExpected.toLocaleString()}
                          </div>
                          <div className={`text-sm ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {balance > 0 ? `₦${balance.toLocaleString()} remaining` : 'Fully paid'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingStudent(student);
                                setShowForm(true);
                              }}
                              className="text-slate-600 hover:text-slate-900 p-1 rounded-md hover:bg-slate-100 transition-colors"
                              aria-label="Edit student"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                              aria-label="Delete student"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-500 mb-4">
              {students.length === 0 ? 'No students found' : 'No students match your filters'}
            </div>
            {students.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              >
                Add Your First Student
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />

      {showForm && (
        <StudentForm
          onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
          onCancel={() => {
            setShowForm(false);
            setEditingStudent(null);
          }}
          initialData={editingStudent || undefined}
          isEditing={!!editingStudent}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default Students;