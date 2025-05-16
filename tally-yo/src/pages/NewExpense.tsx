import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import Breadcrumb from '../components/ui/Breadcrumb';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface FormData {
  amount: string;
  date: string;
  expense_category_id: string;
  description: string;
  notes: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
}

export default function NewExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    expense_category_id: '',
    description: '',
    notes: ''
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('expense_categories')
          .select('*')
          .order('name');

        if (error) throw error;
        setExpenseCategories(data || []);
        if (data && data.length > 0 && !formData.expense_category_id) {
          setFormData(prev => ({ ...prev, expense_category_id: data[0].id }));
        }
      } catch (error) {
        console.error('Error fetching expense categories:', error);
        setError('Failed to load expense categories');
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchExpense() {
      if (!id || !user?.id) return;

      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          // Format the date to YYYY-MM-DD for input[type="date"]
          const formattedDate = new Date(data.date).toISOString().split('T')[0];
          setFormData({
            amount: data.amount.toString(),
            date: formattedDate,
            expense_category_id: data.expense_category_id,
            description: data.description || '',
            notes: data.notes || '',
          });
        }
      } catch (error) {
        console.error('Error fetching expense:', error);
        setError('Failed to load expense');
      }
    }

    fetchExpense();
  }, [id, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const expenseData = {
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
        expense_category_id: formData.expense_category_id,
        description: formData.description,
        notes: formData.notes,
        user_id: user.id
      };

      let error;
      
      if (id) {
        // Update existing expense
        const { error: updateError } = await supabase
          .from('expenses')
          .update(expenseData)
          .eq('id', id)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Insert new expense
        const { error: insertError } = await supabase
          .from('expenses')
          .insert([expenseData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(id ? 'Expense updated successfully!' : 'Expense added successfully!');
      navigate('/expenses');
    } catch (err) {
      console.error('Error saving expense:', err);
      setError('Failed to save expense');
      toast.error('Failed to save expense');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const breadcrumbItems = [
    { name: 'Expenses', href: '/expenses' },
    { name: id ? 'Edit Expense' : 'New Expense', href: '#' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Breadcrumb items={breadcrumbItems} />
      
      <h1 className="text-2xl font-bold text-white mb-6">
        {id ? 'Edit Expense' : 'New Expense'}
      </h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            required
            value={formData.amount}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-300">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="expense_category_id" className="block text-sm font-medium text-gray-300">
            Category
          </label>
          <select
            id="expense_category_id"
            name="expense_category_id"
            required
            value={formData.expense_category_id}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {expenseCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/expenses')}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span>Saving...</span>
              </>
            ) : (
              <span>{id ? 'Update Expense' : 'Add Expense'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
