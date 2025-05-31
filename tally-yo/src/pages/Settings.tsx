import { useNavigate } from 'react-router-dom';
import { TagIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-center items-center mb-6 relative">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <div className="w-[88px]"></div> {/* Spacer to balance the title */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Categories Card */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:bg-gray-700 transition-colors cursor-pointer"
             onClick={() => navigate('/expense-categories')}>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-600 p-3 rounded-lg">
              <TagIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Expense Categories</h2>
          </div>
          <p className="text-gray-400">
            Manage your expense categories and their icons. Add, edit, or remove categories to better organize your expenses.
          </p>
        </div>

        {/* Deposit Types Card */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:bg-gray-700 transition-colors cursor-pointer"
             onClick={() => navigate('/deposit-types')}>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-600 p-3 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Deposit Types</h2>
          </div>
          <p className="text-gray-400">
            Manage your deposit types and their icons. Add, edit, or remove types to better organize your wages and income.
          </p>
        </div>
      </div>
    </div>
  );
} 