"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserRowSkeleton from '@/components/admin/UserRowSkeleton';
import ReviewerLayout from '@/components/reviewer/ReviewerLayout';
import { SubmissionDetailsModal } from '@/components/reviewer/SubmissionDetailsModal';
import { BadgeCheck, Clock, ThumbsUp, ThumbsDown, XCircle, MapPin, AlertTriangle } from 'lucide-react';
import { showToast } from '@/lib/toast';
import toast from 'react-hot-toast';
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
  address_line_2?: string;
  zip_code?: string;
  contact_phone?: string;
  website_url?: string;
  email?: string;
  geocoding_status?: string;
  geocoding_error?: string;
  latitude?: string;
  longitude?: string;
  needs_geocoding_review?: boolean;
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
  const [processing, setProcessing] = useState<string | null>(null);
  const [updatingCoordinates, setUpdatingCoordinates] = useState<string | null>(null);

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

  async function handleUpdateCoordinates(submissionId: string) {
    if (!selected) {
      console.log('No submission selected!');
      return;
    }

    // Debug console - show current submission info
    console.log('DEBUG INFO:', {
      submissionId,
      currentLatitude: selected.latitude || 'null',
      currentLongitude: selected.longitude || 'null',
      address: selected.address,
      city: selected.city,
      state: selected.state,
      zip: selected.zip_code
    });

    try {
      setUpdatingCoordinates(submissionId);
      
      const requestBody = {
        submissionId: submissionId,
        address: selected.address,
        address_line_2: selected.address_line_2,
        city: selected.city,
        state: selected.state,
        zip_code: selected.zip_code,
      };

      // Debug console - show request body
      console.log('API REQUEST:', requestBody);

      const response = await fetch('/api/review/obtain-coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('API ERROR:', error);
        throw new Error(error.error || 'Failed to update coordinates');
      }

      const result = await response.json();
      
      // Debug console - show API response
      console.log('API RESPONSE:', result);
      
      // Update the selected submission with new coordinates
      const updatedSubmission = {
        ...selected,
        latitude: result.latitude.toString(),
        longitude: result.longitude.toString(),
        needs_geocoding_review: result.needs_geocoding_review,
      };

      // Debug console - show updated submission
      console.log('UPDATED SUBMISSION:', updatedSubmission);

      setSelected(updatedSubmission);

      // Don't refresh the submissions list immediately to avoid overwriting the selected state
      // The coordinates are already updated in the selected state above
      
      if (result.needs_geocoding_review) {
        showToast.error('⚠️ Coordinates updated but may need review. Please verify the address accuracy.');
      } else {
        showToast.success('✅ Coordinates updated successfully');
      }
    } catch (err) {
      console.error('ERROR:', err instanceof Error ? err.message : 'Failed to update coordinates');
      showToast.error(err instanceof Error ? err.message : 'Failed to update coordinates');
    } finally {
      setUpdatingCoordinates(null);
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
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {submissions.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          className="font-medium text-emerald-600 underline hover:text-emerald-700"
                          onClick={() => setSelected(s)}
                        >
                          {s.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 capitalize whitespace-nowrap text-sm text-gray-700">{s.service_type.replace('_', ' ')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          {s.city}, {s.state}
                          {s.geocoding_status === 'failed' && (
                            <span title={s.geocoding_error ?? ''}>
                              <AlertTriangle className="h-4 w-4 ml-2 text-amber-500" />
                            </span>
                          )}
                          {s.geocoding_status === 'success' && (
                            <MapPin className="h-4 w-4 ml-2 text-emerald-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(s.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {s.status === 'approved' ? (
                          <span className="flex items-center text-emerald-600"><BadgeCheck className="h-4 w-4 mr-1"/>Approved</span>
                        ) : s.status === 'rejected' ? (
                          <span className="flex items-center text-red-600"><XCircle className="h-4 w-4 mr-1"/>Rejected</span>
                        ) : (
                          <span className="flex items-center text-yellow-600"><Clock className="h-4 w-4 mr-1"/>Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex justify-center">
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
        {/* Submission Details Modal */}
        <SubmissionDetailsModal
          key={selected?.id || 'no-selection'}
          submission={selected}
          isOpen={Boolean(selected)}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          processing={processing || updatingCoordinates}
          onUpdateCoordinates={handleUpdateCoordinates}
        />
      </div>
    </ReviewerLayout>
  );
} 