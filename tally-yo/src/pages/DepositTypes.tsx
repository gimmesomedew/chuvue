import { useState, useEffect } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import Breadcrumb from '../components/ui/Breadcrumb';

interface DepositType {
  id: string;
  name: string;
  description: string;
  color: string;
  user_id: string;
}

export default function DepositTypes() {
  const { user } = useAuth();
  const [types, setTypes] = useState<DepositType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingType, setEditingType] = useState<DepositType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6'
  });

  // Fetch deposit types
  useEffect(() => {
    if (user?.id) fetchTypes();
  }, [user]);

  const fetchTypes = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('wage_types')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setTypes(data || []);
    } catch (err) {
      toast.error('Failed to load deposit types');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      const { name, description, color } = formData;
      if (!name.trim()) {
        toast.error('Name is required');
        return;
      }

      if (editingType) {
        // Update existing type
        const { error } = await supabase
          .from('wage_types')
          .update({ name, description, color })
          .eq('id', editingType.id)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success('Deposit type updated');
      } else {
        // Create new type
        const { error } = await supabase
          .from('wage_types')
          .insert([{
            name,
            description,
            color,
            user_id: user.id
          }]);

        if (error) throw error;
        toast.success('Deposit type created');
      }

      // Reset form and refresh list
      setFormData({ name: '', description: '', color: '#3b82f6' });
      setIsAddModalOpen(false);
      setEditingType(null);
      fetchTypes();
    } catch (err) {
      toast.error('Failed to save deposit type');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deposit type?')) return;

    try {
      const { error } = await supabase
        .from('wage_types')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Deposit type deleted');
      fetchTypes();
    } catch (err) {
      toast.error('Failed to delete deposit type');
    }
  };

  const handleEdit = (type: DepositType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      description: type.description || '',
      color: type.color
    });
    setIsAddModalOpen(true);
  };

  const filteredTypes = types.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Breadcrumb
        items={[
          { name: 'Wages', href: '/wages' },
          { name: 'Deposit Types' }
        ]}
      />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Your Deposit Types</h1>
        <button
          onClick={() => {
            setEditingType(null);
            setFormData({ name: '', description: '', color: '#3b82f6' });
            setIsAddModalOpen(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add New
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search deposit types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Color</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTypes.map((type) => (
                <tr key={type.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 text-sm text-white">{type.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{type.description || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      <span className="text-sm text-gray-300">{type.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(type)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingType ? 'Edit Deposit Type' : 'New Deposit Type'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter description (optional)"
                />
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-300 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="block w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingType ? 'Save Changes' : 'Create Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
