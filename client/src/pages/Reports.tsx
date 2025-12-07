import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Download, Upload, FileSpreadsheet} from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import api from '../lib/axios';

interface Category {
  id: string;
  name: string;
  amount: number;
}

// interface ReportData {
//   id: string;
//   studentName: string;
//   categoryName: string;
//   amount: string;
//   paymentDate: string;
//   paymentMethod: string;
//   reference?: string;
// }

const Reports = () => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await api.get('/categories/active');
        const categoriesData = response.data.data || response.data || [];
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    // Fetch classes
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const response = await api.get('/classes');
        const classesData = response.data.data || response.data || [];
        setClasses(classesData.map((cls: any) => cls.name));
      } catch (error) {
        console.error('Failed to load classes:', error);
        setClasses(['SS1', 'SS2', 'SS3']);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchCategories();
    fetchClasses();
  }, []);

  const handleGenerateReport = async () => {
    if (!dateFrom || !dateTo) {
      toast.error('Please select both start and end dates');
      return;
    }

    setIsGenerating(true);
    
    try {
      const params: any = {
        dateFrom,
        dateTo
      };

      if (selectedCategory) {
        params.categoryId = selectedCategory;
      }

      if (selectedClass) {
        params.class = selectedClass;
      }

      const response = await api.get('/reports/generate', {
        params,
        responseType: 'blob' // Important for file download
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current timestamp
      const timestamp = format(new Date(), 'yyyy-MM-dd-HHmm');
      link.setAttribute('download', `payments-report-${timestamp}.xlsx`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report generated and downloaded successfully');
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast.error(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(response.data.message || 'Excel file processed successfully');
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error.response?.data?.message || 'Failed to process Excel file');
    } finally {
      setIsUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await api.get('/reports/template', {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'payment-upload-template.xlsx');
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Template downloaded successfully');
    } catch (error: any) {
      console.error('Error downloading template:', error);
      toast.error(error.response?.data?.message || 'Failed to download template');
    }
  };

  const reportTypes = [
    {
      title: 'Payment Summary Report',
      description: 'Overview of all payments within a date range',
      icon: FileSpreadsheet,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Student Payment Status',
      description: 'Detailed payment status for each student',
      icon: FileSpreadsheet,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Category Performance',
      description: 'Payment collection rates by category',
      icon: FileSpreadsheet,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Outstanding Balances',
      description: 'Students with pending payments',
      icon: FileSpreadsheet,
      color: 'bg-red-100 text-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Reports & Excel Management</h1>
          <p className="text-slate-600 mt-1">Generate reports and manage bulk payment imports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Excel Export Section */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center mb-4">
              <Download className="h-5 w-5 text-slate-600 mr-2" />
              <h2 className="text-lg font-semibold text-slate-900">Generate Excel Report</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dateFrom" className="block text-sm font-medium text-slate-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    id="dateFrom"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="dateTo" className="block text-sm font-medium text-slate-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    id="dateTo"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                    Category (Optional)
                  </label>
                  {loadingCategories ? (
                    <div className="text-slate-500 text-sm">Loading categories...</div>
                  ) : (
                    <select
                      id="category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div>
                  <label htmlFor="class" className="block text-sm font-medium text-slate-700 mb-1">
                    Class (Optional)
                  </label>
                  {loadingClasses ? (
                    <div className="text-slate-500 text-sm">Loading classes...</div>
                  ) : (
                    <select
                      id="class"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="">All Classes</option>
                      {classes.map((className) => (
                        <option key={className} value={className}>
                          {className}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating || !dateFrom || !dateTo}
                className="w-full bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Generate & Download Report</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Excel Import Section */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center mb-4">
              <Upload className="h-5 w-5 text-slate-600 mr-2" />
              <h2 className="text-lg font-semibold text-slate-900">Import Payments from Excel</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 mb-2">
                  Upload an Excel file with payment data
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Supported formats: .xlsx, .xls (Max 10MB)
                </p>
                
                <label className="inline-block">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <span className={`bg-slate-100 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-200 cursor-pointer transition-colors inline-flex items-center space-x-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        <span>Choose File</span>
                      </>
                    )}
                  </span>
                </label>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-900 mb-2">Excel Format Requirements:</h4>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Column A: Student ID (e.g., "STU001")</li>
                  <li>• Column B: Category Name (e.g., "SS1 School Fees")</li>
                  <li>• Column C: Amount (e.g., "50000")</li>
                  <li>• Column D: Payment Date (YYYY-MM-DD)</li>
                  <li>• Column E: Payment Method (cash, bank_transfer, card, cheque)</li>
                  <li>• Column F: Reference (Optional)</li>
                </ul>
              </div>
              
              <button
                onClick={downloadTemplate}
                className="w-full bg-slate-100 text-slate-700 py-2 px-4 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download Template</span>
              </button>
            </div>
          </div>
        </div>

        {/* Report Types */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Report Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map((report, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className={`inline-flex p-2 rounded-lg ${report.color} mb-3`}>
                  <report.icon className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-slate-900 mb-2">{report.title}</h3>
                <p className="text-sm text-slate-600">{report.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports - Optional: You can fetch recent reports from API if available */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mt-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Reports</h2>
          <div className="space-y-3">
            {[
              { name: 'Payment Summary - January 2025', date: '2025-01-15', size: '2.3 MB' },
              { name: 'Student Payment Status - December 2024', date: '2025-01-10', size: '1.8 MB' },
              { name: 'Outstanding Balances - Q4 2024', date: '2025-01-05', size: '1.2 MB' },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{report.name}</p>
                    <p className="text-xs text-slate-500">Generated on {report.date} • {report.size}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toast.info('Report download would be implemented here')}
                  className="text-slate-600 hover:text-slate-900 p-1 rounded-md hover:bg-slate-100 transition-colors"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;