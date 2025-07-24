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
import { getServiceDefinitionsWithCounts, ServiceDefinitionWithCount, getSectionDisplayConfig, saveSectionDisplayConfig } from '@/lib/services';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';

interface ServiceStats {
  totalServices: number;
  featuredServices: number;
  pendingSubmissions: number;
}

// Temporary: Section display config state (would be loaded/saved from DB in a real app)
const initialSectionDisplayConfig: Record<string, { showSocial: boolean; showPetInfo: boolean }> = {
  landscape: { showSocial: false, showPetInfo: false },
  default: { showSocial: true, showPetInfo: true },
};

// List of all optional/conditional sections from add-listing
const OPTIONAL_SECTIONS = [
  { key: 'showSocial', label: 'Social Links' },
  { key: 'showPetInfo', label: 'Pet Information' },
];

export function ServicesManagement() {
  const [serviceDefinitionsWithCounts, setServiceDefinitionsWithCounts] = useState<ServiceDefinitionWithCount[]>([]);
  const [serviceStats, setServiceStats] = useState<ServiceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionConfig, setSectionConfig] = useState<Record<string, Record<string, boolean>>>(initialSectionDisplayConfig);
  const [showSectionConfigModal, setShowSectionConfigModal] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<{ service_type: string; service_name: string }[]>([]);
  const [loadingServiceTypes, setLoadingServiceTypes] = useState(true);
  const [savingSectionConfig, setSavingSectionConfig] = useState(false);

  // Fetch all service types from Supabase on mount
  useEffect(() => {
    async function fetchServiceTypes() {
      setLoadingServiceTypes(true);
      try {
        const defs = await getServiceDefinitionsWithCounts(); // Changed to getServiceDefinitionsWithCounts to get service_name
        setServiceTypes(defs.map(d => ({ service_type: d.service_type, service_name: d.service_name })));
        // Ensure sectionConfig has an entry for each service_type
        setSectionConfig(prev => {
          const updated = { ...prev };
          defs.forEach(d => {
            if (!updated[d.service_type]) {
              updated[d.service_type] = { showSocial: true, showPetInfo: true };
            }
          });
          return updated;
        });
      } finally {
        setLoadingServiceTypes(false);
      }
    }
    if (showSectionConfigModal) fetchServiceTypes();
  }, [showSectionConfigModal]);

  // Load section config from Supabase when modal opens
  useEffect(() => {
    async function fetchConfig() {
      const config = await getSectionDisplayConfig();
      setSectionConfig(prev => ({ ...prev, ...config }));
    }
    if (showSectionConfigModal) fetchConfig();
  }, [showSectionConfigModal]);

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

  async function handleSaveSectionConfig() {
    setSavingSectionConfig(true);
    try {
      await saveSectionDisplayConfig(sectionConfig);
      toast.success('Section display settings saved');
      setShowSectionConfigModal(false);
    } catch (err) {
      toast.error('Failed to save section display settings');
    } finally {
      setSavingSectionConfig(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Services Management</h1>
          <p className="text-gray-600">Manage service definitions and monitor service statistics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadServicesData} variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowSectionConfigModal(true)} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Section Display
          </Button>
        </div>
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
          <Link href="/review/pending" className="block">
            <Card className="hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer">
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
          </Link>
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

      {/* Section Display Config Modal (dynamic) */}
      {showSectionConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Section Display Per Service Type</h2>
            {loadingServiceTypes ? (
              <div className="text-center py-8 text-gray-500">Loading service types...</div>
            ) : (
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-2">Service Type</th>
                    {OPTIONAL_SECTIONS.map(section => (
                      <th key={section.key} className="text-center py-2 px-2">{section.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {serviceTypes.map(({ service_type, service_name }) => (
                    <tr key={service_type}>
                      <td className="py-2 px-2 font-medium">{service_name}</td>
                      {OPTIONAL_SECTIONS.map(section => (
                        <td key={section.key} className="py-2 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={sectionConfig[service_type]?.[section.key] ?? true}
                            onChange={e => setSectionConfig(sc => ({
                              ...sc,
                              [service_type]: {
                                ...sc[service_type],
                                [section.key]: e.target.checked
                              }
                            }))}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="text-blue-700 border-blue-700 border bg-white hover:bg-blue-50"
                onClick={() => setShowSectionConfigModal(false)}
                disabled={savingSectionConfig}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#11055F] text-white hover:bg-[#2a1a7f]"
                onClick={handleSaveSectionConfig}
                disabled={savingSectionConfig}
              >
                {savingSectionConfig ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 