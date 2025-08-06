'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building, MapPin, Check, X, Copy } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { SubmissionMap } from './SubmissionMap';
import { getServiceDefinitions } from '@/lib/services';
import type { ServiceDefinition } from '@/lib/types';

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

interface SubmissionDetailsModalProps {
  submission: Submission | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (submissionId: string) => void;
  onReject: (submissionId: string) => void;
  processing: string | null;
  onUpdateCoordinates?: (submissionId: string) => Promise<void>;
}

export function SubmissionDetailsModal({
  submission,
  isOpen,
  onClose,
  onApprove,
  onReject,
  processing,
  onUpdateCoordinates
}: SubmissionDetailsModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [serviceDefinitions, setServiceDefinitions] = useState<ServiceDefinition[]>([]);
  const [isLoadingDefinitions, setIsLoadingDefinitions] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editableSubmission, setEditableSubmission] = useState<Submission | null>(null);

  // Load service definitions
  useEffect(() => {
    async function loadServiceDefinitions() {
      try {
        const definitions = await getServiceDefinitions();
        setServiceDefinitions(definitions);
      } catch (error) {
        console.error('Error loading service definitions:', error);
      } finally {
        setIsLoadingDefinitions(false);
      }
    }
    loadServiceDefinitions();
  }, []);

  // Initialize editable submission when modal opens
  useEffect(() => {
    if (submission) {
      setEditableSubmission({ ...submission });
    }
  }, [submission]);

  // Debug effect - show console log when coordinates change
  useEffect(() => {
    if (submission) {
      console.log('MODAL COORDINATES UPDATED:', {
        submissionId: submission.id,
        latitude: submission.latitude || 'null',
        longitude: submission.longitude || 'null',
        name: submission.name
      });
    }
  }, [submission?.latitude, submission?.longitude, submission?.id]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      showToast.success('Copied to clipboard');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      showToast.error('Failed to copy to clipboard');
    }
  };

  const handleUpdateSubmission = async () => {
    if (!editableSubmission) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/review/submissions/${editableSubmission.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editableSubmission),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update submission');
      }

      showToast.success('Submission updated successfully');
      
      // Update the original submission with the new data
      if (submission) {
        Object.assign(submission, editableSubmission);
      }
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : 'Failed to update submission');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFieldChange = (field: keyof Submission, value: string) => {
    if (editableSubmission) {
      setEditableSubmission({
        ...editableSubmission,
        [field]: value,
      });
    }
  };

  if (!submission) return null;

  // Debug alert - show coordinates when modal renders
  console.log('Modal rendering with coordinates:', {
    latitude: submission.latitude,
    longitude: submission.longitude,
    submissionId: submission.id
  });

  const fullAddress = `${submission.address}${submission.address_line_2 ? `, ${submission.address_line_2}` : ''}, ${submission.city}, ${submission.state} ${submission.zip_code}, United States`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-0 bg-gray-900">
        {/* Header */}
        <div className="bg-primary text-white p-6 relative">
          <DialogClose className="absolute right-4 top-4 text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </DialogClose>
          <h2 className="text-2xl font-bold mb-2">{submission.name}</h2>
          <p className="text-white/80">Dog Care Service Listing - Submission Details</p>
        </div>

        {/* Content */}
        <div className="p-6 bg-white">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Business Information */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <Building className="h-5 w-5 text-primary" />
                  Business Information
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Business Name</Label>
                    <Input 
                      value={editableSubmission?.name || submission.name} 
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className="bg-white border-gray-300 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Service Type</Label>
                    <select 
                      value={editableSubmission?.service_type || submission.service_type} 
                      onChange={(e) => handleFieldChange('service_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={isLoadingDefinitions}
                    >
                      {isLoadingDefinitions ? (
                        <option>Loading service types...</option>
                      ) : (
                        <>
                          <option value="">Select service type</option>
                          {serviceDefinitions.map((def) => (
                            <option key={def.service_type} value={def.service_type}>
                              {def.service_name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <Input 
                      value={editableSubmission?.email || submission.email || ''} 
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      className="bg-white border-gray-300 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Phone</Label>
                    <Input 
                      value={editableSubmission?.contact_phone || submission.contact_phone || ''} 
                      onChange={(e) => handleFieldChange('contact_phone', e.target.value)}
                      className="bg-white border-gray-300 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea 
                      value={editableSubmission?.description || submission.description || ''} 
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      className="bg-white border-gray-300 focus:border-primary focus:ring-primary resize-none"
                      rows={6}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Address & Coordinates */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <MapPin className="h-5 w-5 text-primary" />
                  Address & Location Coordinates
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Full Address</Label>
                    <Input 
                      value={fullAddress} 
                      readOnly 
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Latitude</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          value={submission.latitude || ''} 
                          readOnly 
                          className="bg-gray-50 border-gray-200"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(submission.latitude || '', 'latitude')}
                          className="p-1"
                        >
                          <Copy className={`h-4 w-4 ${copiedField === 'latitude' ? 'text-brand-orange' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Longitude</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          value={submission.longitude || ''} 
                          readOnly 
                          className="bg-gray-50 border-gray-200"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(submission.longitude || '', 'longitude')}
                          className="p-1"
                        >
                          <Copy className={`h-4 w-4 ${copiedField === 'longitude' ? 'text-brand-orange' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Marker Box */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-gray-800">Location Marker</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="text-gray-700">
                    {submission.address}
                    {submission.address_line_2 && (
                      <><br/>{submission.address_line_2}</>
                    )}
                    <br/>{submission.city}, {submission.state}
                  </div>
                  
                  {submission.latitude && submission.longitude && (
                    <div className="text-gray-600">
                      <div>Lat: {parseFloat(submission.latitude).toFixed(7)}</div>
                      <div>Lng: {parseFloat(submission.longitude).toFixed(7)}</div>
                      <div className="mt-2">
                        <a 
                          href={`https://www.google.com/maps?q=${submission.latitude},${submission.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary/80 underline"
                        >
                          View on Google Maps →
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Map */}
            <div className="space-y-4">
              {/* Google Maps */}
              <SubmissionMap
                latitude={submission.latitude}
                longitude={submission.longitude}
                address={submission.address}
                name={submission.name}
              />

              {/* Map Controls */}
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline" className="p-2">
                  <div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
                </Button>
                <Button size="sm" variant="outline" className="p-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Button
                onClick={() => onApprove(submission.id)}
                disabled={processing === submission.id}
                className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-2"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve Listing
              </Button>
              
              <Button
                onClick={() => onReject(submission.id)}
                disabled={processing === submission.id}
                className="bg-secondary hover:bg-pink-700 text-white px-6 py-2"
              >
                <X className="h-4 w-4 mr-2" />
                Reject Listing
              </Button>
              
              {onUpdateCoordinates && (
                <Button
                  onClick={() => onUpdateCoordinates(submission.id)}
                  disabled={processing === submission.id}
                  className="bg-third hover:bg-blue-700 text-white px-6 py-2"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Update Coordinates
                </Button>
              )}
              
              <Button
                onClick={handleUpdateSubmission}
                disabled={isUpdating || processing === submission.id}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
              >
                <Check className="h-4 w-4 mr-2" />
                {isUpdating ? 'Updating...' : 'Update Submission'}
              </Button>
            </div>
            
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 