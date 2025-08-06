'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Users, 
  MousePointer, 
  BarChart3
} from 'lucide-react';
import { getAnalyticsSummary, getAnalyticsByDateRange } from '@/lib/analytics';
import { CacheManagement } from './CacheManagement';

interface AnalyticsData {
  summary: {
    totalSearches: number;
    totalPageViews: number;
    totalInteractions: number;
  };
  topSearches: Array<{ search_term: string; count: number }>;
  topServiceTypes: Array<{ service_type: string; count: number }>;
  errors: any[];
}

export function AdminDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Load analytics data
      const analytics = await getAnalyticsSummary(selectedPeriod);
      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDateRangeAnalytics = async () => {
    if (!dateRange.startDate || !dateRange.endDate) return;
    
    setIsLoading(true);
    try {
      const data = await getAnalyticsByDateRange(dateRange.startDate, dateRange.endDate);
      console.log('Date range analytics:', data);
    } catch (error) {
      console.error('Error loading date range analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor user engagement, search patterns, and system performance</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
          
          <Button onClick={loadAnalyticsData} variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
                  <Search className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData ? formatNumber(analyticsData.summary.totalSearches) : '0'}
                  </div>
                  <p className="text-xs text-gray-600">
                    +{analyticsData ? getPercentageChange(analyticsData.summary.totalSearches, 0) : 0}% from last period
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData ? formatNumber(analyticsData.summary.totalPageViews) : '0'}
                  </div>
                  <p className="text-xs text-gray-600">
                    +{analyticsData ? getPercentageChange(analyticsData.summary.totalPageViews, 0) : 0}% from last period
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">User Interactions</CardTitle>
                  <MousePointer className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData ? formatNumber(analyticsData.summary.totalInteractions) : '0'}
                  </div>
                  <p className="text-xs text-gray-600">
                    +{analyticsData ? getPercentageChange(analyticsData.summary.totalInteractions, 0) : 0}% from last period
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Top Searches */}
      {analyticsData?.topSearches.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Top Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analyticsData.topSearches.slice(0, 10).map((search, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span className="font-medium">{search.search_term}</span>
                  <span className="text-gray-600">{search.count} searches</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Top Service Types */}
      {analyticsData?.topServiceTypes.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Service Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analyticsData.topServiceTypes.slice(0, 10).map((serviceType, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span className="font-medium">{serviceType.service_type}</span>
                  <span className="text-gray-600">{serviceType.count} interactions</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Error Display */}
      {analyticsData?.errors.length ? (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Analytics Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analyticsData.errors.map((error, index) => (
                <div key={index} className="text-sm text-red-700">
                  Error {index + 1}: {error?.message || 'Unknown error'}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Cache Management */}
      <CacheManagement />
    </div>
  );
} 