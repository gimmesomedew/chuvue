import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Service } from '@/lib/types';
import { showToast } from '@/lib/toast';
import { supabase } from '@/lib/supabase';
import { Upload } from 'lucide-react';

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
    city: service.city,
    state: service.state,
    zip_code: service.zip_code,
    website_url: service.website_url || '',
    image_url: service.image_url || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Add validation
      const updatedService = {
        ...service,
        ...formData,
      };
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
      const bucket = 'service-images';
      // ensure bucket exists
      const { error: bucketErr } = await supabase.storage.createBucket(bucket, { public: true }).catch(()=>({error:null}));
      if (bucketErr && bucketErr?.message && bucketErr.message !== 'Bucket already exists') throw bucketErr;

      const filePath = `${bucket}/${service.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage
        .from(bucket)
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
            <div className="mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-emerald-600 hover:text-emerald-700">
                <Upload className="h-4 w-4" /> Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 