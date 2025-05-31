import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft } from 'lucide-react';
import IconPicker from '../components/ui/IconPicker';
import toast from 'react-hot-toast';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
  icon: string;
}

export default function ExpenseCategories() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'CircleDot'
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function fetchCategories() {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('expense_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // Update the categories state with the latest data
      setCategories(data || []);
      return true; // Indicate successful refresh
    } catch (err) {
      console.error('Error fetching expense categories:', err);
      setError('Failed to load expense categories');
      return false; // Indicate failed refresh
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const categoryData = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        user_id: user.id
      };

      let error;

      if (editingCategory) {
        const { error: updateError } = await supabase
          .from('expense_categories')
          .update(categoryData)
          .eq('id', editingCategory.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('expense_categories')
          .insert([categoryData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(editingCategory ? 'Category updated!' : 'Category added!');
      setFormData({ name: '', description: '', icon: 'CircleDot' });
      setEditingCategory(null);
      setIsFormVisible(false);
      
      // Ensure we refresh the categories list
      await fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      setError('Failed to save category');
      toast.error('Failed to save category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: ExpenseCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon || 'CircleDot'
    });
  };

  const handleDelete = async (id: string) => {
    console.log('[ExpenseCategories] handleDelete called with:', id);
    if (!user || !window.confirm('Are you sure you want to delete this category?')) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('expense_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Category deleted!');
      // Ensure we refresh the categories list
      await fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIconChange = (icon: string) => {
    console.log('[ExpenseCategories] handleIconChange called with:', icon);
    try {
      setFormData(prev => {
        console.log('[ExpenseCategories] Current formData:', prev);
        const newData = { ...prev, icon };
        console.log('[ExpenseCategories] New formData:', newData);
        return newData;
      });
    } catch (err) {
      console.error('[ExpenseCategories] Error in handleIconChange:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (error) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Expense Categories</h1>
          <button
            onClick={() => setIsFormVisible(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Category
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          </div>
        )}
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </button>
        </nav>
        <div className="flex justify-center items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Expense Categories</h1>
          <div className="w-[88px]"></div>
          <button
            onClick={() => setIsFormVisible(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Category
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          </div>
        )}

        {isFormVisible && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={() => {
                  setIsFormVisible(false);
                  setEditingCategory(null);
                  setFormData({ name: '', description: '', icon: 'CircleDot' });
                }}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Icon
                </label>
                <IconPicker value={formData.icon} onChange={handleIconChange} />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormVisible(false);
                    setEditingCategory(null);
                    setFormData({ name: '', description: '', icon: 'CircleDot' });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
                Icon
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                Description
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {categories.map(category => (
              <tr key={category.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                  {category.icon}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                  {category.name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                  {category.description}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => {
                        handleEdit(category);
                        setIsFormVisible(true);
                      }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-400 transition-colors"
                      onClick={() => handleDelete(category.id)}
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
