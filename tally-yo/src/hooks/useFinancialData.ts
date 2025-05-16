import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useFinancialData(user: User | null) {
  const [totalWages, setTotalWages] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch wages
        const { data: wagesData, error: wagesError } = await supabase
          .from('wages')
          .select('amount')
          .eq('user_id', user.id);

        if (wagesError) throw wagesError;

        // Fetch expenses
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('amount')
          .eq('user_id', user.id);

        if (expensesError) throw expensesError;

        // Calculate totals
        const wagesTotal = wagesData.reduce((sum, wage) => sum + parseFloat(wage.amount), 0);
        const expensesTotal = expensesData.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

        setTotalWages(wagesTotal);
        setTotalExpenses(expensesTotal);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { totalWages, totalExpenses, isLoading, error };
}
