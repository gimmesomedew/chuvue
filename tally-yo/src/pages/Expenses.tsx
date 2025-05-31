import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { PlusCircleIcon, TagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import StatCard from '../components/ui/StatCard';
import ExpenseItem from '../components/ExpenseItem';

export default function Expenses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 5;
  
  const {
    expenses,
    totalCount,
    monthlyTotal,
    yearToDate,
    isLoading,
    error
  } = useExpenses(user, currentPage, pageSize, searchTerm);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error loading expenses: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-center items-center mb-6 relative">
        <h1 className="text-2xl font-bold text-white">Expenses</h1>
        <div className="w-[88px]"></div> {/* Spacer to balance the title */}
      </div>

      {/* Summary Cards */}
      <div className="flex flex-nowrap justify-center gap-4 mb-8 pb-2 -mx-4 px-4 overflow-x-auto">
        <StatCard
          title="Total Expenses"
          value={yearToDate}
          subtitle="Year To Date"
        />
        <StatCard
          title="This Month"
          value={monthlyTotal}
          subtitle={new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className="w-[300px] bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-center font-bold"
          onClick={() => navigate('/expenses/new')}
        >
          <div className="flex items-center justify-center gap-2">
            <PlusCircleIcon className="h-5 w-5" />
            <span>New Expense</span>
          </div>
        </button>
        <button
          className="w-[300px] bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 border border-slate-600 shadow-sm transition-colors text-center font-bold"
          onClick={() => navigate('/expense-categories')}
        >
          <div className="flex items-center justify-center gap-2">
            <TagIcon className="h-5 w-5" />
            <span>Expense Categories</span>
          </div>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <form onSubmit={(e) => {
            e.preventDefault();
            setSearchTerm(searchQuery);
            setCurrentPage(1);
          }} className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span>Search</span>
            </button>
          </form>
        </div>
        <button
          className="bg-slate-800 text-slate-400 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          Filter
        </button>
      </div>

      {/* Expenses List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-slate-400">Description</th>
                  <th className="px-6 py-3 text-sm font-medium text-slate-400 text-center">Category</th>
                  <th className="px-6 py-3 text-sm font-medium text-slate-400">Notes</th>
                  <th className="px-6 py-3 text-sm font-medium text-slate-400 text-right">Amount</th>
                  <th className="px-6 py-3 text-sm font-medium text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {expenses.map(expense => (
                  <ExpenseItem key={expense.id} expense={expense} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-slate-400">
              Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-slate-800 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-slate-800 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
