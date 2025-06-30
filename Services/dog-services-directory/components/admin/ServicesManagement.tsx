'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Database,
  Settings,
  TrendingUp,
  BarChart3,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { getServiceDefinitionsWithCounts, ServiceDefinitionWithCount } from '@/lib/services';
import { supabase } from '@/lib/supabase';

interface ServiceStats {
  totalServices: number;
  featuredServices: number;
  pendingSubmissions: number;
}

export function ServicesManagement() {
  const [serviceDefinitionsWithCounts, setServiceDefinitionsWithCounts] = useState<ServiceDefinitionWithCount[]>([]);
  const [serviceStats, setServiceStats] = useState<ServiceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServicesData();
  }, []);

  const loadServicesData = async () => {
    setIsLoading(true);
    try {
      console.log('Loading services data...');
      
      // Load service definitions with counts using the database function
      const definitionsWithCounts = await getServiceDefinitionsWithCounts();
      console.log('Service definitions with counts loaded:', definitionsWithCounts);
      
      if (definitionsWithCounts.length === 0) {
        console.warn('No service definitions returned, this might indicate an issue with the database function');
      }
      
      setServiceDefinitionsWithCounts(definitionsWithCounts);

      // Load service statistics
      await loadServiceStats();
    } catch (error) {
      console.error('Error loading services data:', error);
      // Set empty array to prevent undefined errors
      setServiceDefinitionsWithCounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadServiceStats = async () => {
    try {
      // Get total services count
      const { count: totalServices } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true });

      // Get featured services count
      const { count: featuredServices } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('featured', 'Y');

      // Get pending submissions count
      const { count: pendingSubmissions } = await supabase
        .from('service_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setServiceStats({
        totalServices: totalServices || 0,
        featuredServices: featuredServices || 0,
        pendingSubmissions: pendingSubmissions || 0,
      });
    } catch (error) {
      console.error('Error loading service stats:', error);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Services Management</h1>
          <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
          <h1 className="text-3xl font-bold">Services Management</h1>
          <p className="text-gray-600">Manage service definitions and monitor service statistics</p>
        </div>
        
        <Button onClick={loadServicesData} variant="outline">
          <BarChart3 className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Service Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Services</CardTitle>
              <Database className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serviceStats ? formatNumber(serviceStats.totalServices) : '0'}
              </div>
              <p className="text-xs text-gray-600">
                All services in the system
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured Services</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serviceStats ? formatNumber(serviceStats.featuredServices) : '0'}
              </div>
              <p className="text-xs text-gray-600">
                Promoted services
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
              <Settings className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serviceStats ? formatNumber(serviceStats.pendingSubmissions) : '0'}
              </div>
              <p className="text-xs text-gray-600">
                Awaiting review
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Types</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serviceDefinitionsWithCounts.length}
              </div>
              <p className="text-xs text-gray-600">
                Available categories
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Service Definitions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Service Definitions
            </CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Definition
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">ID</th>
                  <th className="text-left py-3 px-4 font-medium">Service Name</th>
                  <th className="text-left py-3 px-4 font-medium">Service Type</th>
                  <th className="text-left py-3 px-4 font-medium">Services Count</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {serviceDefinitionsWithCounts.map((definition) => (
                  <tr key={definition.service_definition_id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{definition.service_definition_id}</td>
                    <td className="py-3 px-4 font-medium">{definition.service_name}</td>
                    <td className="py-3 px-4 text-gray-600">{definition.service_type}</td>
                    <td className="py-3 px-4">
                      {formatNumber(definition.services_count)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 