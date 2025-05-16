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
  wage_type_id: string;
  wage_type: WageType;
  notes?: string;
}

interface WageType {
  id: string;
  name: string;
  description: string;
}

export function useWages(user: User | null, page: number = 1, pageSize: number = 5, searchQuery: string = '') {
  const [wages, setWages] = useState<Wage[]>([]);
  const [wageTypes, setWageTypes] = useState<WageType[]>([]);
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

        // Fetch paginated wages with wage types
        // First get the wage types for reference
        const { data: wageTypesData, error: typesError } = await supabase
          .from('wage_types')
          .select('*');

        if (typesError) throw typesError;

        // Then fetch wages with wage type info
        const { data: wagesData, error: wagesError, count } = await supabase
          .from('wages')
          .select('id, amount, date, description, wage_type_id, notes', { count: 'exact' })
          .eq('user_id', user.id)
          .ilike('description', `%${searchQuery}%`)
          .order('date', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);

        if (wagesError) throw wagesError;

        // Map wage types to wages
        const transformedWages = wagesData?.map(wage => {
          const wageType = wageTypesData?.find(type => type.id === wage.wage_type_id);
          return {
            ...wage,
            wage_type: wageType || { id: '', name: 'Unknown', description: '' }
          };
        }) || [];



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
        setWageTypes(wageTypesData || []);
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
  }, [user, page, pageSize]);

  return {
    wages,
    wageTypes,
    totalCount,
    monthlyTotal,
    yearToDate,
    isLoading,
    error
  };
}
