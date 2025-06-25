"use client";

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import UserRowSkeleton from '@/components/admin/UserRowSkeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  pet_name: string | null;
  email: string | null;
  role: string;
  profile_photo: string | null;
  created_at: string;
}

const PAGE_SIZE = 25;

export default function AdminReviewersPage() {
  const { userRole } = useAuth();
  const router = useRouter();

  const [reviewers, setReviewers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Add Reviewer dialog state
  const [creating, setCreating] = useState(false);
  const [candidateUsers, setCandidateUsers] = useState<Profile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  // Redirect non-admins
  useEffect(() => {
    if (userRole !== 'admin') {
      router.push('/');
    }
  }, [userRole, router]);

  useEffect(() => {
    fetchReviewers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Load candidate users (non-reviewers)
  useEffect(() => {
    async function loadCandidates() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, pet_name')
        .neq('role', 'reviewer')
        .order('email');
      if (!error && data) {
        setCandidateUsers(data as Profile[]);
      }
    }
    loadCandidates();
  }, []);

  async function fetchReviewers() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/admin/users?role=reviewer&page=${page}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch');
      }
      const json = await res.json();
      setReviewers(json.data);
      setTotalCount(json.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviewers');
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  function handlePrev() {
    setPage((p) => Math.max(0, p - 1));
  }

  function handleNext() {
    setPage((p) => Math.min(totalPages - 1, p + 1));
  }

  async function handleCreateReviewer() {
    if (!selectedUserId) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUserId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'reviewer' }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update role');
      }
      // Refresh lists
      setSelectedUserId('');
      fetchReviewers();
      // remove from candidate list
      setCandidateUsers((prev) => prev.filter((u) => u.id !== selectedUserId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to assign reviewer role');
    } finally {
      setCreating(false);
    }
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reviewer Management</h1>
          <p className="text-gray-600">Add and manage platform reviewers</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="btn btn-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Reviewer
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Reviewer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Select User Email</Label>
                <select
                  className="select select-bordered w-full"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <option value="">-- Select user --</option>
                  {candidateUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.email} {u.pet_name ? `(${u.pet_name})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <button className="btn" disabled={creating}>Cancel</button>
              </DialogClose>
              <button className="btn btn-primary" onClick={handleCreateReviewer} disabled={creating}>
                {creating ? 'Creating...' : 'Create'}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      {loading ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
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
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {reviewers.map((r) => (
                  <tr key={r.id}>
                    <td>
                      {r.profile_photo ? (
                        <img src={r.profile_photo} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                          {r.pet_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                    </td>
                    <td>{r.pet_name || '-'}</td>
                    <td>{r.email || '-'}</td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button className="btn btn-sm" disabled={page === 0} onClick={handlePrev}>Previous</button>
              <span className="text-sm">Page {page + 1} of {totalPages}</span>
              <button className="btn btn-sm" disabled={page + 1 >= totalPages} onClick={handleNext}>Next</button>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
} 