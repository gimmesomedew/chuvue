import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Service } from '@/lib/types';
import { showToast } from '@/lib/toast';
import { supabase } from '@/lib/supabase';
import { Camera, Loader2, Upload } from 'lucide-react';

export interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  onUpdate: (service: Service) => void;
}

export function EditServiceModal({ isOpen, onClose, service, onUpdate }: EditServiceModalProps) {
  const [formData, setFormData] = useState({
    name: service.name,
    description: service.description,
    address: service.address,
    address_line_2: service.address_line_2 || '',
    city: service.city,
    state: service.state,
    zip_code: service.zip_code,
    website_url: service.website_url || '',
    image_url: service.image_url || '',
  });

  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Update failed');

      const updatedService = { ...service, ...formData } as Service;
      onUpdate(updatedService);
      onClose();
      showToast.success('Service updated successfully');
    } catch (error) {
      console.error('Error updating service:', error);
      showToast.error('Failed to update service');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const filePath = `${service.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('pet_photos')
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage
        .from('pet_photos')
        .getPublicUrl(filePath);
      if (pub?.publicUrl) {
        setFormData(prev => ({ ...prev, image_url: pub.publicUrl }));
        showToast.success('Image uploaded');
      }
    } catch (err) {
      console.error('Image upload error', err);
      showToast.error('Failed to upload image');
    } finally {
      e.target.value = '';
    }
  };

  const handleCaptureScreenshot = async () => {
    if (!formData.website_url) {
      showToast.error('Please enter a website URL first');
      return;
    }

    setIsCapturingScreenshot(true);
    try {
      console.log('Starting screenshot capture for:', formData.website_url);
      
      const res = await fetch('/api/services/screenshot-working', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          websiteUrl: formData.website_url
        }),
      });

      console.log('Screenshot API response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Screenshot API error:', errorData);
        throw new Error(errorData.error || 'Screenshot capture failed');
      }

      const json = await res.json();
      console.log('Screenshot API success response:', json);
      
      setFormData(prev => ({ ...prev, image_url: json.screenshotUrl }));
      showToast.success('Website screenshot captured successfully!');
    } catch (error) {
      console.error('Screenshot capture error:', error);
      showToast.error(`Failed to capture screenshot: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCapturingScreenshot(false);
    }
  };

  const handleExtractLogo = async () => {
    if (!formData.website_url) {
      showToast.error('Please enter a website URL first');
      return;
    }

    setIsCapturingScreenshot(true);
    try {
      console.log('Starting logo extraction for:', formData.website_url);
      
      const res = await fetch('/api/services/extract-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          websiteUrl: formData.website_url
        }),
      });

      console.log('Logo extraction API response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Logo extraction API error:', errorData);
        throw new Error(errorData.error || 'Logo extraction failed');
      }

      const json = await res.json();
      console.log('Logo extraction API success response:', json);
      
      setFormData(prev => ({ ...prev, image_url: json.imageUrl }));
      showToast.success('Logo extracted successfully!');
    } catch (error) {
      console.error('Logo extraction error:', error);
      showToast.error(`Failed to extract logo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCapturingScreenshot(false);
    }
  };

  const handleExtractRichData = async () => {
    if (!formData.website_url) {
      showToast.error('Please enter a website URL first');
      return;
    }

    setIsCapturingScreenshot(true);
    try {
      console.log('Starting rich data extraction for:', formData.website_url);
      
      const res = await fetch('/api/services/extract-rich-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          websiteUrl: formData.website_url
        }),
      });

      console.log('Rich data extraction API response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Rich data extraction API error:', errorData);
        throw new Error(errorData.error || 'Rich data extraction failed');
      }

      const json = await res.json();
      console.log('Rich data extraction API success response:', json);
      
      setFormData(prev => ({ ...prev, image_url: json.imageUrl }));
      showToast.success('Rich data extracted successfully!');
    } catch (error) {
      console.error('Rich data extraction error:', error);
      showToast.error(`Failed to extract rich data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCapturingScreenshot(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Service Name"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
              />
            </div>
            <div>
              <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
              <Input
                id="address_line_2"
                name="address_line_2"
                value={formData.address_line_2}
                onChange={handleChange}
                placeholder="Apt, Suite, Unit, etc."
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>
            <div>
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                id="zip_code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                placeholder="ZIP Code"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              name="website_url"
              value={formData.website_url}
              onChange={handleChange}
              placeholder="Website URL"
              type="url"
            />
          </div>
          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Image URL"
              type="url"
            />
            <div className="mt-2 flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-emerald-600 hover:text-emerald-700">
                <Upload className="h-4 w-4" /> Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
                {formData.website_url && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCaptureScreenshot}
                      disabled={isCapturingScreenshot}
                      className="flex items-center gap-2 text-sm"
                      title="Capture a full screenshot of the website"
                    >
                      {isCapturingScreenshot ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Capturing...
                        </>
                      ) : (
                        <>
                          <Camera className="h-4 w-4" />
                          Capture Screenshot
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleExtractLogo}
                      disabled={isCapturingScreenshot}
                      className="flex items-center gap-2 text-sm"
                      title="Extract logo and brand images from the website (requires Browserless.io API key)"
                    >
                      {isCapturingScreenshot ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Extracting...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Extract Logo
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleExtractRichData}
                      disabled={isCapturingScreenshot}
                      className="flex items-center gap-2 text-sm"
                      title="Extract Open Graph images and rich link previews from the website"
                    >
                      {isCapturingScreenshot ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Extracting...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Extract Rich Data
                        </>
                      )}
                    </Button>
                  </div>
                )}
            </div>
            {formData.website_url && !formData.image_url && (
              <p className="text-xs text-gray-500 mt-1">
                💡 No image? Use "Capture Screenshot" to automatically capture the website!
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 