import { PencilIcon } from '@heroicons/react/24/outline';
import { icons } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExpenseItemProps {
  expense: { // Define the structure of the expense object passed as a prop
    id: string;
    description: string;
    date: string;
    notes?: string;
    amount: number;
    expense_category: { // Define the structure of the nested expense_category object
      icon: string;
      name: string;
    };
  };
}

function ExpenseItem({ expense }: ExpenseItemProps) {
  const navigate = useNavigate();

  const IconComponent = icons[expense.expense_category.icon as keyof typeof icons];

  return (
    <tr key={expense.id} className="hover:bg-slate-700/50">
      <td className="px-6 py-4">
        <div className="text-base text-white font-bold">{expense.description || 'No description'}</div>
        <div className="text-sm text-slate-300">{new Date(expense.date).toLocaleDateString()}</div>
      </td>
      <td className="px-6 py-4 text-slate-300">
        <div className="flex justify-center">
          {IconComponent ? (
            <div title={expense.expense_category.name}>
              <IconComponent className="h-5 w-5" />
            </div>
          ) : (
            <span className="text-sm">{expense.expense_category.name}</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-pre-wrap text-gray-300">
        {expense.notes || '-'}
      </td>
      <td className="px-6 py-4 text-right">
        <span className="text-lg font-medium text-emerald-400">
          ${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => navigate(`/expenses/edit/${expense.id}`)}
          className="text-gray-400 hover:text-white transition-colors"
          title="Edit expense"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}

export default ExpenseItem; 