'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

interface ErrorLog {
  id: string;
  error_message: string;
  action: string;
  context: string;
  user_id: string | null;
  user_email: string | null;
  created_at: string;
  stack_trace: string | null;
  additional_data: any;
}

export default function ErrorLogsPage() {
  const { user, userRole } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null);
  const [filter, setFilter] = useState({
    action: '',
    userEmail: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (userRole !== 'admin') {
      router.push('/');
      return;
    }
    fetchLogs();
  }, [userRole, router]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Apply filters
      if (filter.action) {
        query = query.ilike('action', `%${filter.action}%`);
      }
      if (filter.userEmail) {
        query = query.ilike('user_email', `%${filter.userEmail}%`);
      }
      if (filter.startDate) {
        query = query.gte('created_at', filter.startDate);
      }
      if (filter.endDate) {
        query = query.lte('created_at', filter.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch error logs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleClearFilters = () => {
    setFilter({
      action: '',
      userEmail: '',
      startDate: '',
      endDate: '',
    });
    fetchLogs();
  };

  if (userRole !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Error Logs</h1>

        {/* Filters */}
        <form onSubmit={handleFilterSubmit} className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              name="action"
              placeholder="Filter by action"
              value={filter.action}
              onChange={handleFilterChange}
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="userEmail"
              placeholder="Filter by user email"
              value={filter.userEmail}
              onChange={handleFilterChange}
              className="input input-bordered w-full"
            />
            <input
              type="date"
              name="startDate"
              value={filter.startDate}
              onChange={handleFilterChange}
              className="input input-bordered w-full"
            />
            <input
              type="date"
              name="endDate"
              value={filter.endDate}
              onChange={handleFilterChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn btn-ghost"
            >
              Clear Filters
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>Error</th>
                  <th>User</th>
                  <th>Context</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</td>
                    <td>{log.action}</td>
                    <td className="max-w-xs truncate">{log.error_message}</td>
                    <td>{log.user_email || 'N/A'}</td>
                    <td className="max-w-xs truncate">{log.context}</td>
                    <td>
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="btn btn-sm btn-ghost"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for detailed view */}
        {selectedLog && (
          <div className="modal modal-open">
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-lg mb-4">Error Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Error Message</h4>
                  <p className="whitespace-pre-wrap">{selectedLog.error_message}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Action</h4>
                  <p>{selectedLog.action}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Context</h4>
                  <p className="whitespace-pre-wrap">{selectedLog.context}</p>
                </div>
                {selectedLog.stack_trace && (
                  <div>
                    <h4 className="font-semibold">Stack Trace</h4>
                    <pre className="bg-base-300 p-4 rounded-lg overflow-x-auto">
                      {selectedLog.stack_trace}
                    </pre>
                  </div>
                )}
                {selectedLog.additional_data && (
                  <div>
                    <h4 className="font-semibold">Additional Data</h4>
                    <pre className="bg-base-300 p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(selectedLog.additional_data, null, 2)}
                    </pre>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">User</h4>
                    <p>{selectedLog.user_email || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Time</h4>
                    <p>{new Date(selectedLog.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setSelectedLog(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 