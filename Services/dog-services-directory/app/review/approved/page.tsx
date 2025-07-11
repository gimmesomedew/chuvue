"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserRowSkeleton from '@/components/admin/UserRowSkeleton';
import ReviewerLayout from '@/components/reviewer/ReviewerLayout';
import { BadgeCheck } from 'lucide-react';

interface Submission {
  id: string;
  name: string;
  service_type: string;
  city: string;
  state: string;
  created_at: string;
}

const PAGE_SIZE = 25;

export default function ApprovedSubmissionsPage() {
  const { userRole } = useAuth();
  const router = useRouter();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // guard access
  useEffect(() => {
    if (userRole !== 'reviewer' && userRole !== 'admin') {
      router.push('/');
    }
  }, [userRole, router]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const status = 'approved';
  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/review/submissions?status=${status}&page=${page}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch');
      }
      const json = await res.json();
      setSubmissions(json.data);
      setTotalCount(json.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <ReviewerLayout>
      <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6">Approved Service Listings</h1>
        {error && <div className="alert alert-error mb-4">{error}</div>}
        {loading ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Approved</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <UserRowSkeleton key={i} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Approved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {submissions.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-gray-700">{s.service_type.replace('_', ' ')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.city}, {s.state}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex justify-center"><BadgeCheck className="text-emerald-600 h-4 w-4" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button className="btn btn-sm" disabled={page===0} onClick={()=>setPage(p=>p-1)}>Previous</button>
                <span className="text-sm">Page {page+1} of {totalPages}</span>
                <button className="btn btn-sm" disabled={page+1>=totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
              </div>
            )}
          </div>
        )}
      </div>
    </ReviewerLayout>
  );
} 