import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryForm from '../components/CategoryForm';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../lib/axios';


interface Category {
  id: string;
  name: string;
  amount: number;
  description?: string;
  isActive: boolean;
  studentsCount: number;
  totalCollected: number;
}

type CategoryFormData = {
  name: string;
  amount: number;
  description?: string;
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      console.log(res.data.data);
      setCategories(res.data.data);
    } catch (err) {
      toast.error('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (data: CategoryFormData): Promise<void> => {
    setIsSaving(true);
    return api
      .post('/categories', data)
      .then(() => {
        toast.success('Category added successfully');
        setShowForm(false);
        loadCategories();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to add category');
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleEditCategory = async (data: CategoryFormData): Promise<void> => {
    if (!editingCategory) return;

    setIsSaving(true);
    return api
      .put(`/categories/${editingCategory.id}`, data)
      .then(() => {
        toast.success('Category updated successfully');
        setShowForm(false);
        setEditingCategory(null);
        loadCategories();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to update category');
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      loadCategories();
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const toggleCategoryStatus = async (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;

    try {
      await api.patch(`/categories/${id}/toggle-status`);
      toast.success('Status updated');
      loadCategories();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getCollectionRate = (category: Category) => {
    const expected = category.amount * category.studentsCount;
    return expected > 0 ? Math.round((category.totalCollected / expected) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Payment Categories</h1>
            <p className="text-slate-600 mt-1">Manage school fee categories and amounts</p>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setShowForm(true);
            }}
            className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Collection Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white text-black divide-y divide-slate-200">
                {categories.map((category) => {
                  const rate = getCollectionRate(category);
                  return (
                    <tr key={category.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">{category.name}</div>
                        {category.description && (
                          <div className="text-sm text-slate-500">{category.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ₦{category.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{category.studentsCount}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{rate}%</span>
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                rate >= 80 ? 'bg-green-500' : rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(rate, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleCategoryStatus(category.id)}
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            category.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              setEditingCategory(category);
                              setShowForm(true);
                            }}
                            className="text-slate-600 hover:text-slate-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-800 hover:text-red-900"
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

        {categories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-slate-500 mb-4">No categories yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-slate-600 text-white px-6 py-3 rounded-md hover:bg-slate-700"
            >
              Add Your First Category
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Modal Form */}
      {showForm && (
        <CategoryForm
          onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
          onCancel={() => {
            setShowForm(false);

            setEditingCategory(null);
          }}
          initialData={editingCategory || undefined}
          isEditing={!!editingCategory}
          isLoading={isSaving} // disables form while saving
        />
      )}
    </div>
  );
};

export default Categories;