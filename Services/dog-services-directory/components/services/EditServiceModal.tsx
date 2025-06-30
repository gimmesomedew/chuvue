import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Service } from '@/lib/types';
import { showToast } from '@/lib/toast';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Service Name"
            />
          </div>
          <div>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
            />
          </div>
          <div>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
            <Input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />
            <Input
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              placeholder="ZIP Code"
            />
          </div>
          <div>
            <Input
              name="website_url"
              value={formData.website_url}
              onChange={handleChange}
              placeholder="Website URL"
              type="url"
            />
          </div>
          <div>
            <Input
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Image URL"
              type="url"
            />
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