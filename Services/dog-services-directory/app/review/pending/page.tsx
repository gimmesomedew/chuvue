"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserRowSkeleton from '@/components/admin/UserRowSkeleton';
import ReviewerLayout from '@/components/reviewer/ReviewerLayout';
import { BadgeCheck, Clock, ThumbsUp, ThumbsDown, XCircle, MapPin, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
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
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['details', 'address']));
  const [obtainingCoordinates, setObtainingCoordinates] = useState(false);
  const [lastCoordinateUpdate, setLastCoordinateUpdate] = useState<Date | null>(null);
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    address: '',
    address_line_2: '',
    city: '',
    state: '',
    zip_code: ''
  });
  const [saving, setSaving] = useState(false);

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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddressForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startEditingAddress = () => {
    if (selected) {
      setAddressForm({
        address: selected.address || '',
        address_line_2: selected.address_line_2 || '',
        city: selected.city || '',
        state: selected.state || '',
        zip_code: selected.zip_code || ''
      });
      setEditingAddress(true);
    }
  };

  const cancelEditingAddress = () => {
    setEditingAddress(false);
    setAddressForm({
      address: '',
      address_line_2: '',
      city: '',
      state: '',
      zip_code: ''
    });
  };

  const saveAddress = async () => {
    if (!selected) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/services/${selected.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: addressForm.address,
          address_line_2: addressForm.address_line_2,
          city: addressForm.city,
          state: addressForm.state,
          zip_code: addressForm.zip_code,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save address');
      }

      // Update the selected submission with new address
      setSelected(prev => prev ? {
        ...prev,
        address: addressForm.address,
        address_line_2: addressForm.address_line_2,
        city: addressForm.city,
        state: addressForm.state,
        zip_code: addressForm.zip_code,
      } : null);

      setEditingAddress(false);
      toast.success('Address saved successfully');
      
      // Refresh the submissions list
      fetchSubmissions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const obtainCoordinates = async (submission: Submission) => {
    const addressToUse = editingAddress ? addressForm : submission;
    
    if (!addressToUse.address || !addressToUse.city || !addressToUse.state || !addressToUse.zip_code) {
      toast.error('Missing address information required for geocoding');
      return;
    }

    setObtainingCoordinates(true);
    try {
      const response = await fetch('/api/review/obtain-coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId: submission.id,
          address: addressToUse.address,
          address_line_2: addressToUse.address_line_2,
          city: addressToUse.city,
          state: addressToUse.state,
          zip_code: addressToUse.zip_code,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to obtain coordinates');
      }

      const result = await response.json();
      
      // Set the timestamp for the coordinate update with a small delay for visual effect
      setTimeout(() => {
        setLastCoordinateUpdate(new Date());
      }, 100);

      // Fetch the updated submission data directly
      try {
        const submissionResponse = await fetch(`/api/review/submissions?status=${status}&page=${page}`);
        if (submissionResponse.ok) {
          const submissionData = await submissionResponse.json();
          const updatedSubmission = submissionData.data.find((s: Submission) => s.id === submission.id);
          if (updatedSubmission) {
            setSelected({
              ...updatedSubmission,
              latitude: result.latitude.toString(),
              longitude: result.longitude.toString(),
              needs_geocoding_review: result.needs_geocoding_review,
            });
          } else {
            // Fallback: update with the result data
            setSelected(prev => prev ? {
              ...prev,
              latitude: result.latitude.toString(),
              longitude: result.longitude.toString(),
              needs_geocoding_review: result.needs_geocoding_review,
            } : null);
          }
        }
      } catch {
        // Fallback: update with the result data
        setSelected(prev => prev ? {
          ...prev,
          latitude: result.latitude.toString(),
          longitude: result.longitude.toString(),
          needs_geocoding_review: result.needs_geocoding_review,
        } : null);
      }

      // Refresh the submissions list
      fetchSubmissions();

      if (result.needs_geocoding_review) {
        toast.error('⚠️ Geocoding used fallback coordinates. Please verify the address is correct and try again.', {
          duration: 5000,
          icon: '⚠️'
        });
      } else {
        toast.success('✅ Coordinates obtained successfully');
      }
    } catch {
      toast.error('❌ Failed to obtain coordinates. Please check the address and try again.', {
        duration: 5000,
        icon: '⚠️'
      });
    } finally {
      setObtainingCoordinates(false);
    }
  };

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
                          onClick={() => {
                            setSelected(s);
                            setExpandedSections(new Set(['details', 'address']));
                            setLastCoordinateUpdate(null);
                            setEditingAddress(false);
                            setAddressForm({
                              address: '',
                              address_line_2: '',
                              city: '',
                              state: '',
                              zip_code: ''
                            });
                          }}
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
        {/* Details Modal */}
        <Dialog open={Boolean(selected)} onOpenChange={(o)=>!o && setSelected(null)}>
          {selected && (
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">{selected.name}</DialogTitle>
              </DialogHeader>
              
              {/* Accordion Sections */}
              <div className="space-y-3">
                {/* Basic Details Section */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleSection('details')}
                    className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors duration-200 ${
                      expandedSections.has('details') 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-semibold">Basic Details</span>
                    <span className="text-xs text-gray-500">4 items</span>
                    {expandedSections.has('details') ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.has('details') && (
                    <div className="p-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><span className="font-medium">Type:</span> {selected.service_type}</div>
                        <div><span className="font-medium">Status:</span> {selected.status}</div>
                        <div><span className="font-medium">Phone:</span> {selected.contact_phone}</div>
                        {selected.website_url && <div><span className="font-medium">Website:</span> <a href={selected.website_url} target="_blank" className="text-blue-600 underline">{selected.website_url}</a></div>}
                      </div>
                      <div className="mt-4">
                        <span className="font-medium">Description:</span>
                        <div className="mt-1 text-gray-700">{selected.description}</div>
                      </div>
                    </div>
                  )}
                </div>

                                {/* Address & Coordinates Section */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleSection('address')}
                    className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors duration-200 ${
                      obtainingCoordinates 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : expandedSections.has('address') 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-semibold">Address & Coordinates</span>
                    <span className="text-xs text-gray-500">
                      {obtainingCoordinates ? 'Updating...' : 
                       selected.latitude && selected.longitude ? '2 items' : '1 item'}
                    </span>
                    {expandedSections.has('address') ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.has('address') && (
                    <div className="p-4 border-t">
                      <div className="space-y-4">
                        {/* Address Information */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Full Address:</span>
                            {!editingAddress ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={startEditingAddress}
                                className="text-xs"
                              >
                                ✏️ Edit Address
                              </Button>
                            ) : (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEditingAddress}
                                  className="text-xs"
                                >
                                  ❌ Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={saveAddress}
                                  disabled={saving}
                                  className="text-xs"
                                >
                                  {saving ? '💾 Saving...' : '💾 Save'}
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          {!editingAddress ? (
                            <div className="mt-1 text-gray-700">
                              {selected.address}
                              {selected.address_line_2 && (
                                <><br/>{selected.address_line_2}</>
                              )}
                              <br/>{selected.city}, {selected.state} {selected.zip_code}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div>
                                <Label htmlFor="address">Address</Label>
                                <Input
                                  id="address"
                                  value={addressForm.address}
                                  onChange={(e) => handleAddressChange('address', e.target.value)}
                                  placeholder="Street address"
                                />
                              </div>
                              <div>
                                <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                                <Input
                                  id="address_line_2"
                                  value={addressForm.address_line_2}
                                  onChange={(e) => handleAddressChange('address_line_2', e.target.value)}
                                  placeholder="Apt, Suite, Unit, etc."
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <Label htmlFor="city">City</Label>
                                  <Input
                                    id="city"
                                    value={addressForm.city}
                                    onChange={(e) => handleAddressChange('city', e.target.value)}
                                    placeholder="City"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="state">State</Label>
                                  <Input
                                    id="state"
                                    value={addressForm.state}
                                    onChange={(e) => handleAddressChange('state', e.target.value)}
                                    placeholder="State"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="zip_code">ZIP Code</Label>
                                  <Input
                                    id="zip_code"
                                    value={addressForm.zip_code}
                                    onChange={(e) => handleAddressChange('zip_code', e.target.value)}
                                    placeholder="ZIP"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Obtain Coordinates Button - More Prominent */}
                                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium text-blue-900">Get Coordinates from Address</span>
                              <MapPin className="h-5 w-5 text-blue-600" />
                            </div>
                            <p className="text-sm text-blue-700 mb-3">
                              Click the button below to automatically obtain latitude and longitude coordinates for this address.
                              {editingAddress && (
                                <span className="block mt-1 text-orange-600 font-medium">
                                  ⚠️ Using edited address - save changes first for best results
                                </span>
                              )}
                            </p>
                            <Button
                              size="default"
                              variant="default"
                              onClick={() => obtainCoordinates(selected)}
                              disabled={obtainingCoordinates}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                            >
                              {obtainingCoordinates ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Obtaining Coordinates...
                                </>
                              ) : (
                                <>
                                  <MapPin className="h-4 w-4 mr-2" />
                                  Obtain Coordinates from Address
                                </>
                              )}
                            </Button>
                            {editingAddress && (
                              <p className="text-xs text-gray-600 mt-2">
                                💡 Tip: Save your address changes first, then get coordinates for the updated address
                              </p>
                            )}
                          </div>

                        {/* Coordinates Display */}
                        {selected.latitude && selected.longitude && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium">Current Coordinates</span>
                              <div className="flex gap-2">
                                {selected.needs_geocoding_review && (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                                    lastCoordinateUpdate && !obtainingCoordinates ? 'bg-yellow-200 text-yellow-900 shadow-sm' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Needs Review
                                  </span>
                                )}
                                {!selected.needs_geocoding_review && (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                                    lastCoordinateUpdate && !obtainingCoordinates ? 'bg-green-200 text-green-900 shadow-sm' : 'bg-green-100 text-green-800'
                                  }`}>
                                    <MapPin className="h-3 w-3 mr-1" />
                                    Verified
                                  </span>
                                )}
                              </div>
                            </div>
                            
                                                         <div className={`font-mono text-sm transition-all duration-500 ${
                               lastCoordinateUpdate && !obtainingCoordinates ? 'bg-green-50 p-3 rounded border border-green-200 shadow-sm animate-pulse' : 'bg-white p-3 rounded border'
                             }`}>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-gray-500 text-xs">Latitude</span>
                                  <div className="font-semibold">{parseFloat(selected.latitude).toFixed(6)}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500 text-xs">Longitude</span>
                                  <div className="font-semibold">{parseFloat(selected.longitude).toFixed(6)}</div>
                                </div>
                              </div>
                            </div>

                            {obtainingCoordinates && (
                              <div className="mt-3 text-sm text-blue-600 animate-pulse">
                                🔄 Updating coordinates...
                              </div>
                            )}
                            {lastCoordinateUpdate && !obtainingCoordinates && (
                              <div className="mt-3 text-sm text-green-600">
                                ✅ Updated {lastCoordinateUpdate.toLocaleTimeString()}
                              </div>
                            )}

                            <div className="mt-3 text-xs text-gray-500">
                              {parseFloat(selected.latitude) >= 39.0 && parseFloat(selected.latitude) <= 40.0 && 
                               parseFloat(selected.longitude) >= -87.0 && parseFloat(selected.longitude) <= -86.0 ? 
                               "✅ Coordinates appear to be in Indiana region" : 
                               "⚠️ Coordinates may be outside expected region"}
                            </div>

                            <div className="mt-3">
                              <a 
                                href={`https://www.google.com/maps?q=${selected.latitude},${selected.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 underline"
                              >
                                📍 View on Google Maps
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          </div>
                        )}

                        {/* No Coordinates State */}
                        {!selected.latitude && !selected.longitude && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                            <div className="text-gray-500 mb-3">No coordinates available yet</div>
                            <p className="text-sm text-gray-600 mb-3">
                              Use the button above to generate coordinates from the address.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Section */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleSection('email')}
                    className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors duration-200 ${
                      expandedSections.has('email') 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-semibold">Email Submitter</span>
                    <span className="text-xs text-gray-500">3 fields</span>
                    {expandedSections.has('email') ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.has('email') && (
                    <div className="p-4 border-t">
                      <div className="space-y-4">
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
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
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