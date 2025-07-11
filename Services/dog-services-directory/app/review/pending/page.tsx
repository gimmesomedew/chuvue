"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserRowSkeleton from '@/components/admin/UserRowSkeleton';
import ReviewerLayout from '@/components/reviewer/ReviewerLayout';
import { BadgeCheck, Clock, ThumbsUp, ThumbsDown, XCircle, MapPin, AlertTriangle } from 'lucide-react';
import { showToast } from '@/lib/toast';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Submission {
  id: string;
  name: string;
  service_type: string;
  city: string;
  state: string;
  created_at: string;
  status: string;
  description?: string;
  address?: string;
  zip_code?: string;
  contact_phone?: string;
  website_url?: string;
  email?: string;
  geocoding_status?: string;
  geocoding_error?: string;
  latitude?: string;
  longitude?: string;
}

const PAGE_SIZE = 25;

export default function PendingReviewPage() {
  const { userRole } = useAuth();
  const router = useRouter();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  // redirect users that are neither reviewer nor admin
  useEffect(() => {
    if (userRole !== 'reviewer' && userRole !== 'admin') {
      router.push('/');
    }
  }, [userRole, router]);

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const status = 'pending';
  async function fetchSubmissions() {
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

  function handlePrev() {
    setPage((p) => Math.max(0, p - 1));
  }
  function handleNext() {
    setPage((p) => Math.min(totalPages - 1, p + 1));
  }

  async function handleApprove(submissionId: string) {
    try {
      setProcessing(submissionId);
      const response = await fetch('/api/review/submissions/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve submission');
      }

      if (data.geocodingError) {
        toast('Service approved but address geocoding failed. Please review the location details.', {
          icon: '⚠️',
          duration: 5000
        });
      } else {
        showToast.success('Service approved successfully');
      }
      
      fetchSubmissions(); // Refresh the list
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : 'Failed to approve submission');
    } finally {
      setProcessing(null);
    }
  }

  async function handleReject(submissionId: string) {
    try {
      setProcessing(submissionId);
      const response = await fetch('/api/review/submissions/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reject submission');
      }

      showToast.success('Submission rejected successfully');
      fetchSubmissions(); // Refresh the list
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : 'Failed to reject submission');
    } finally {
      setProcessing(null);
    }
  }

  return (
    <ReviewerLayout>
      <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6">Pending Service Submissions</h1>
        {error && <div className="alert alert-error mb-4">{error}</div>}
        {loading ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
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
            <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <button
                          className="font-medium text-emerald-600 underline hover:text-emerald-700"
                          onClick={() => setSelected(s)}
                        >
                          {s.name}
                        </button>
                      </td>
                      <td className="capitalize">{s.service_type.replace('_', ' ')}</td>
                      <td>
                        <div className="flex items-center">
                          {s.city}, {s.state}
                          {s.geocoding_status === 'failed' && (
                            <span className="ml-2 text-amber-500 flex items-center" title={s.geocoding_error}>
                              <AlertTriangle className="h-4 w-4" />
                            </span>
                          )}
                          {s.geocoding_status === 'success' && (
                            <span className="ml-2 text-emerald-500">
                              <MapPin className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td>{new Date(s.created_at).toLocaleDateString()}</td>
                      <td>
                        {s.status === 'approved' ? (
                          <span className="flex items-center text-emerald-600">
                            <BadgeCheck className="h-4 w-4 mr-1"/>Approved
                          </span>
                        ) : s.status === 'rejected' ? (
                          <span className="flex items-center text-red-600">
                            <XCircle className="h-4 w-4 mr-1"/>Rejected
                          </span>
                        ) : (
                          <span className="flex items-center text-yellow-600">
                            <Clock className="h-4 w-4 mr-1"/>Pending
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            onClick={() => handleApprove(s.id)}
                            disabled={processing === s.id || s.status !== 'pending'}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleReject(s.id)}
                            disabled={processing === s.id || s.status !== 'pending'}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button className="btn btn-sm" disabled={page===0} onClick={handlePrev}>Previous</button>
                <span className="text-sm">Page {page+1} of {totalPages}</span>
                <button className="btn btn-sm" disabled={page+1>=totalPages} onClick={handleNext}>Next</button>
              </div>
            )}
          </div>
        )}
        {/* Details Modal */}
        <Dialog open={Boolean(selected)} onOpenChange={(o)=>!o && setSelected(null)}>
          {selected && (
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">{selected.name}</DialogTitle>
              </DialogHeader>
              {/* Details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm py-2">
                <div><span className="font-medium">Type:</span> {selected.service_type}</div>
                <div><span className="font-medium">Status:</span> {selected.status}</div>
                <div><span className="font-medium">Address:</span> {selected.address}</div>
                <div><span className="font-medium">City/State:</span> {selected.city}, {selected.state} {selected.zip_code}</div>
                <div><span className="font-medium">Phone:</span> {selected.contact_phone}</div>
                {selected.latitude && selected.longitude && (
                  <div className="md:col-span-2"><span className="font-medium">Coordinates:</span> {selected.latitude}, {selected.longitude}</div>
                )}
                {selected.website_url && <div><span className="font-medium">Website:</span> <a href={selected.website_url} target="_blank" className="text-blue-600 underline">{selected.website_url}</a></div>}
                <div className="md:col-span-2"><span className="font-medium">Description:</span><br/>{selected.description}</div>
              </div>
              {/* Email form */}
              <div className="border-t pt-4 mt-4 space-y-4">
                <h3 className="font-semibold">Email Submitter</h3>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Input disabled value={selected.email || ''} />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input value={subject} onChange={(e)=>setSubject(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea rows={4} value={message} onChange={(e)=>setMessage(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <button className="btn">Close</button>
                </DialogClose>
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
                  className="btn btn-primary"
                  onClick={()=>{
                    setSubject(''); setMessage(''); setSelected(null);
                  }}
                >Send Email</a>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </ReviewerLayout>
  );
} 