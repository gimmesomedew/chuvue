import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Breadcrumb from '../components/ui/Breadcrumb';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface WageType {
  id: string;
  name: string;
  description: string;
}

export default function DepositForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    wage_type_id: '',
    description: '',
    notes: '',
  });
  const [wageTypes, setWageTypes] = useState<WageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchDeposit();
    }
  }, [id]);

  const fetchDeposit = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('wages')
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
          wage_type_id: data.wage_type_id,
          description: data.description || '',
          notes: data.notes || '',
        });
      }
    } catch (error) {
      console.error('Error fetching deposit:', error);
      setError('Failed to load deposit');
    }
  };

  // Fetch wage types on component mount
  useEffect(() => {
    async function fetchWageTypes() {
      const { data, error } = await supabase
        .from('wage_types')
        .select('*')
        .order('name');

      if (error) {
        setError('Failed to load wage types');
        return;
      }

      setWageTypes(data || []);
    }

    fetchWageTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsLoading(true);
    setError('');

    try {
      const depositData = {
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
        wage_type_id: formData.wage_type_id,
        description: formData.description,
        notes: formData.notes,
        user_id: user.id,
      };

      let error;
      if (id) {
        // Update existing deposit
        ({ error } = await supabase
          .from('wages')
          .update(depositData)
          .eq('id', id)
          .eq('user_id', user.id));
      } else {
        // Create new deposit
        ({ error } = await supabase
          .from('wages')
          .insert([depositData]));
      }

      if (error) throw error;

      toast.success(id ? 'Deposit updated!' : 'Deposit added!');
      navigate('/wages');
    } catch (error) {
      console.error('Error saving deposit:', error);
      setError('Failed to save deposit');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Breadcrumb
        items={[
          { name: 'Wages', href: '/wages' },
          { name: id ? 'Edit Deposit' : 'New Deposit' }
        ]}
      />
      <h1 className="text-2xl font-bold text-white mb-8">{id ? 'Edit Deposit' : 'New Deposit'}</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="block w-full pl-8 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-2">
              Wage Type
            </label>
            <select
              id="type"
              value={formData.wage_type_id}
              onChange={(e) => setFormData({ ...formData, wage_type_id: e.target.value })}
              className="block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a type</option>
              {wageTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="Enter a short description for this deposit"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
            className="block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="Add any additional notes"
          />
        </div>

        <div className="flex gap-4 mt-10 pb-6">
          <button
            type="button"
            onClick={() => navigate('/wages')}
            className="flex-1 px-4 py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {id ? 'Update Deposit' : 'Add Deposit'}
            {isLoading ? 'Saving...' : 'Save Deposit'}
          </button>
        </div>
      </form>
    </div>
  );
}
