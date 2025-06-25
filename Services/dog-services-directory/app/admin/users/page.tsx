"use client";

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getProfileImage } from '@/types/profile';
import { Pencil, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import UserRowSkeleton from '@/components/admin/UserRowSkeleton';

interface Profile {
  id: string;
  pet_name: string | null;
  email: string | null;
  role: string;
  profile_photo: string | null;
  created_at: string;
}

const PAGE_SIZE = 25;

// Reusable stat card component matching Services page style
function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    emerald: 'text-emerald-500',
    amber: 'text-amber-500',
  };
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between pb-2">
        <span className="text-sm font-medium">{title}</span>
        <svg className={`h-4 w-4 ${colorMap[color]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" /></svg>
      </div>
      <div className="text-2xl font-bold">{new Intl.NumberFormat().format(value)}</div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { userRole } = useAuth();
  const router = useRouter();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [editTarget, setEditTarget] = useState<Profile | null>(null);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);

  interface UserStats {
    total: number;
    admins: number;
    reviewers: number;
    providers: number;
  }

  const [userStats, setUserStats] = useState<UserStats | null>(null);

  // Redirect non-admins
  useEffect(() => {
    if (userRole !== 'admin') {
      router.push('/');
    }
  }, [userRole, router]);

  useEffect(() => {
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function fetchProfiles() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/admin/users?page=${page}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch');
      }
      const json = await res.json();
      setProfiles(json.data);
      setTotalCount(json.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }

  // Load stats counts
  async function loadUserStats() {
    try {
      const roles = ['admin', 'reviewer', 'service_provider'];
      const counts: Record<string, number> = {};
      // total count
      const { count: total } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      for (const r of roles) {
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', r);
        counts[r] = count || 0;
      }

      setUserStats({
        total: total || 0,
        admins: counts['admin'] || 0,
        reviewers: counts['reviewer'] || 0,
        providers: counts['service_provider'] || 0,
      });
    } catch (e) {
      console.error('Error loading user stats', e);
    }
  }

  useEffect(() => {
    loadUserStats();
  }, []);

  async function handleDelete(userId: string) {
    const confirm = window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.');
    if (!confirm) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete');
      }
      // Refresh current page list
      fetchProfiles();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    }
  }

  function openEditModal(p: Profile) {
    setEditTarget(p);
    setEditing({ ...p });
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pet_name: editing.pet_name, email: editing.email, role: editing.role }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save');
      }
      setEditTarget(null);
      fetchProfiles();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  function handlePrev() {
    setPage((p) => Math.max(0, p - 1));
  }

  function handleNext() {
    setPage((p) => Math.min(totalPages - 1, p + 1));
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600">View and administer all platform users</p>
        </div>
        <button onClick={() => { fetchProfiles(); loadUserStats(); }} className="btn btn-outline flex items-center gap-2">
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582M20 20v-5h-.581M4 15v5h5M20 9V4h-5"/></svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={userStats.total} color="blue" />
          <StatCard title="Admins" value={userStats.admins} color="purple" />
          <StatCard title="Reviewers" value={userStats.reviewers} color="emerald" />
          <StatCard title="Providers" value={userStats.providers} color="amber" />
        </div>
      )}

      {error && <div className="alert alert-error mb-4">{error}</div>}

      {loading ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th className="text-center">Actions</th>
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
                  <th>Role</th>
                  <th>Joined</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.profile_photo ? (
                        <img src={p.profile_photo} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                          {p.pet_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                    </td>
                    <td>{p.pet_name || '-'}</td>
                    <td>{p.email || '-'}</td>
                    <td>
                      <span className="badge badge-ghost capitalize">{p.role}</span>
                    </td>
                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 rounded-md hover:bg-gray-100 text-primary-600 hover:text-[#D28001] transition-colors"
                          title="Edit user"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-md hover:bg-gray-100 text-red-600 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button className="btn btn-sm" disabled={page === 0} onClick={handlePrev}>Previous</button>
              <span className="text-sm">
                Page {page + 1} of {totalPages}
              </span>
              <button className="btn btn-sm" disabled={page + 1 >= totalPages} onClick={handleNext}>Next</button>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal using Dialog */}
      {editTarget && editing && (
        <Dialog open={Boolean(editTarget)} onOpenChange={(o) => !o && setEditTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editing.pet_name || ''}
                  onChange={(e) => setEditing({ ...editing, pet_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editing.email || ''}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <select
                  className="select select-bordered w-full"
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                >
                  <option value="pet_owner">Pet Owner</option>
                  <option value="service_provider">Service Provider</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <button className="btn" disabled={saving}>Cancel</button>
              </DialogClose>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
} 