'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { showToast } from '@/lib/toast';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminSettingsPage() {
  const { configs, loading, error, updateConfigs } = useSiteConfig();
  const [isSaving, setIsSaving] = useState(false);
  const [localConfigs, setLocalConfigs] = useState<any[]>([]);
  const { user, userRole } = useAuth();

  // Initialize local configs when data is loaded
  useEffect(() => {
    if (configs.length > 0 && localConfigs.length === 0) {
      setLocalConfigs([...configs]);
    }
  }, [configs, localConfigs.length]);

  const handleInputChange = (index: number, value: string) => {
    const updatedConfigs = [...localConfigs];
    updatedConfigs[index] = { ...updatedConfigs[index], config_value: value };
    setLocalConfigs(updatedConfigs);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const result = await updateConfigs(localConfigs);
      
      if (result.success) {
        showToast.success("Popular search tags updated successfully!");
      } else {
        showToast.error(result.error || "Failed to update configuration");
      }
    } catch (err) {
              showToast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setLocalConfigs([...configs]);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading configuration: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Development Warning Banner */}
        {(!user || userRole !== 'admin') && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  <strong>Development Mode:</strong> You are accessing the admin panel without proper authentication. 
                  This is only for testing purposes. In production, proper authentication will be required.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <h1 className="text-3xl font-bold mb-8">System Settings</h1>
        
        {/* Popular Search Tags Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Popular Search Tags</h2>
          <p className="text-gray-600 mb-6">
            Configure the 6 popular search tags that appear on the homepage. These tags help users quickly access common searches.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {localConfigs.map((config, index) => (
              <div key={config.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {config.description}
                </label>
                <input
                  type="text"
                  value={config.config_value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="Enter search tag text..."
                  maxLength={50}
                />
                <p className="text-xs text-gray-500">
                  {config.config_value.length}/50 characters
                </p>
              </div>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset to Original
            </button>
          </div>
        </div>
        
        {/* Additional Settings Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Additional Settings</h2>
          <p className="text-gray-600">
            More configuration options will be available here as the platform grows.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
} 