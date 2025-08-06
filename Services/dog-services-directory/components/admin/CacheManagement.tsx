'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Trash2, Activity } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: number;
  timestamp: string;
  cacheType: string;
}

export function CacheManagement() {
  const { toast } = useToast();
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/cache/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch cache statistics",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching cache stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cache statistics",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const clearCache = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cache/stats', {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Cache cleared successfully",
        });
        // Refresh stats after clearing
        await fetchStats();
      } else {
        toast({
          title: "Error",
          description: "Failed to clear cache",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast({
        title: "Error",
        description: "Failed to clear cache",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Cache Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.size}</div>
              <div className="text-sm text-gray-600">Cached Items</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.maxSize}</div>
              <div className="text-sm text-gray-600">Max Capacity</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.hitRate}%</div>
              <div className="text-sm text-gray-600">Hit Rate</div>
            </div>
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p><strong>Cache Type:</strong> {stats?.cacheType || 'Memory'}</p>
          <p><strong>Last Updated:</strong> {stats?.timestamp ? new Date(stats.timestamp).toLocaleString() : 'N/A'}</p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={fetchStats} 
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Stats
          </Button>
          
          <Button 
            onClick={clearCache} 
            disabled={isLoading}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cache
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <p><strong>Note:</strong> Cache automatically expires after 5 minutes and is cleaned up every minute.</p>
          <p>Clearing the cache will force fresh database queries for all subsequent searches.</p>
        </div>
      </CardContent>
    </Card>
  );
} 