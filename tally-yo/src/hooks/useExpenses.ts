import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface DatabaseExpense {
  id: string;
  amount: number;
  date: string;
  description: string;
  notes?: string;
  expense_categories: ExpenseCategory;
}

interface Expense {
  id: string;
  amount: number;
  date: string;
  description: string;
  notes?: string;
  expense_category: ExpenseCategory;
}

export function useExpenses(user: User | null, page: number = 1, pageSize: number = 5, searchQuery: string = '') {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [yearToDate, setYearToDate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchExpenses() {
      if (!user) {
        setExpenses([]);
        setTotalCount(0);
        setMonthlyTotal(0);
        setYearToDate(0);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        console.log('Fetching expenses for user:', user.id);
        
        // Fetch expenses with their categories using a join
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select(`
            id,
            amount,
            date,
            description,
            notes,
            expense_categories:expense_categories!inner (id, name, description, icon)
          `)
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .returns<DatabaseExpense[]>();

        console.log('Expenses query result:', { data: expensesData, error: expensesError });
        
        if (expensesError) {
          console.error('Error fetching expenses:', expensesError);
          throw expensesError;
        }

        // If that works, try categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('expense_categories')
          .select('*');

        console.log('Categories query result:', { data: categoriesData, error: categoriesError });
        
        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
          throw categoriesError;
        }

        // Transform the joined data into our expected format
        const transformedExpenses = (expensesData as DatabaseExpense[] | null)?.map(expense => ({
          id: expense.id,
          amount: expense.amount,
          date: expense.date,
          description: expense.description,
          notes: expense.notes,
          expense_category: expense.expense_categories
        })) || [];

        // Calculate monthly and yearly totals from the expenses data
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayOfYear = new Date(now.getFullYear(), 0, 1);

        const monthlyExpenses = expensesData?.filter(expense => 
          new Date(expense.date) >= firstDayOfMonth
        ) || [];

        const yearlyExpenses = expensesData?.filter(expense => 
          new Date(expense.date) >= firstDayOfYear
        ) || [];

        const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
        const yearlyTotal = yearlyExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

        setExpenses(transformedExpenses);
        setExpenseCategories(categoriesData || []);
        setTotalCount(expensesData?.length || 0);
        setMonthlyTotal(monthlyTotal);
        setYearToDate(yearlyTotal);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching expenses'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchExpenses();
  }, [user, page, pageSize, searchQuery]);

  return {
    expenses,
    expenseCategories,
    totalCount,
    monthlyTotal,
    yearToDate,
    isLoading,
    error
  };
}
