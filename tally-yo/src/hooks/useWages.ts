import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface WageType {
  id: string;
  name: string;
  description: string;
}

interface Wage {
  id: string;
  amount: number;
  date: string;
  description: string;
  wage_type: WageType;
  notes?: string;
}

// Define an interface for the data shape returned directly from the Supabase query with the join
interface DatabaseWageWithJoinedType {
  id: string;
  amount: number;
  date: string;
  description: string;
  notes?: string;
  wage_type: WageType[]; // Supabase seems to return joined data as an array
}

export function useWages(user: User | null, page: number = 1, pageSize: number = 5, searchQuery: string = '') {
  const [wages, setWages] = useState<Wage[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [yearToDate, setYearToDate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchWages() {
      if (!user) {
        setWages([]);
        setTotalCount(0);
        setMonthlyTotal(0);
        setYearToDate(0);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);

        // Get current month and year
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const firstDayOfYear = new Date(now.getFullYear(), 0, 1).toISOString();

        // Fetch paginated wages with joined wage types
        const { data, error: wagesError, count } = await supabase
          .from('wages')
          .select(`
            id,
            amount,
            date,
            description,
            notes,
            wage_type:wage_types!inner(id, name, description)
          `, { count: 'exact' })
          .eq('user_id', user.id)
          .ilike('description', `%${searchQuery}%`)
          .order('date', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);

        if (wagesError) throw wagesError;

        // Transform the fetched data to match the Wage interface
        // Access the first element of the wage_type array returned by Supabase
        const transformedWages: Wage[] = (data as DatabaseWageWithJoinedType[] | null)?.map(wage => ({
          id: wage.id,
          amount: wage.amount,
          date: wage.date,
          description: wage.description,
          notes: wage.notes,
          wage_type: wage.wage_type?.[0] || { id: '', name: 'Unknown', description: '' } // Access the first element
        })) || [];

        // Calculate monthly total
        const { data: monthData, error: monthError } = await supabase
          .from('wages')
          .select('amount')
          .eq('user_id', user.id)
          .gte('date', firstDayOfMonth);

        if (monthError) throw monthError;

        // Calculate year to date
        const { data: yearData, error: yearError } = await supabase
          .from('wages')
          .select('amount')
          .eq('user_id', user.id)
          .gte('date', firstDayOfYear);

        if (yearError) throw yearError;

        setWages(transformedWages);
        setTotalCount(count || 0);
        setMonthlyTotal(monthData?.reduce((sum, wage) => sum + wage.amount, 0) || 0);
        setYearToDate(yearData?.reduce((sum, wage) => sum + wage.amount, 0) || 0);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching wages'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchWages();
  }, [user, page, pageSize, searchQuery]);

  return {
    wages,
    totalCount,
    monthlyTotal,
    yearToDate,
    isLoading,
    error
  };
}
