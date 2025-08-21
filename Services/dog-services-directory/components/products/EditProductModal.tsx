import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Product } from '@/lib/types';
import { showToast } from '@/lib/toast';
import { Camera, Loader2, Upload } from 'lucide-react';

export interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onUpdate: (product: Product) => void;
}

export function EditProductModal({ isOpen, onClose, product, onUpdate }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    website: product.website || '',
    contact_number: product.contact_number || '',
    email: product.email || '',
    location_address: product.location_address || '',
    address_line_2: product.address_line_2 || '',
    city: product.city || '',
    state: product.state || '',
    zip_code: product.zip_code || '',
    image_url: product.image_url || '',
  });

  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure website URL has proper protocol
    let processedFormData = { ...formData };
    if (processedFormData.website && !processedFormData.website.startsWith('http://') && !processedFormData.website.startsWith('https://')) {
      processedFormData.website = `https://${processedFormData.website}`;
    }
    
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedFormData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Update failed');

      const updatedProduct = { ...product, ...processedFormData } as Product;
      onUpdate(updatedProduct);
      onClose();
      showToast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      showToast.error('Failed to update product');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCaptureScreenshot = async () => {
    if (!formData.website) {
      showToast.error('Please enter a website URL first');
      return;
    }

    // Ensure URL has proper protocol
    let websiteUrl = formData.website;
    if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
      websiteUrl = `https://${websiteUrl}`;
    }

    setIsCapturingScreenshot(true);
    try {
      console.log('Starting screenshot capture for:', websiteUrl);
      
      const res = await fetch('/api/products/screenshot-working', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          websiteUrl: websiteUrl
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
    if (!formData.website) {
      showToast.error('Please enter a website URL first');
      return;
    }

    // Ensure URL has proper protocol
    let websiteUrl = formData.website;
    if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
      websiteUrl = `https://${websiteUrl}`;
    }

    setIsCapturingScreenshot(true);
    try {
      console.log('Starting logo extraction for:', websiteUrl);
      
      const res = await fetch('/api/products/extract-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          websiteUrl: websiteUrl
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
    if (!formData.website) {
      showToast.error('Please enter a website URL first');
      return;
    }

    // Ensure URL has proper protocol
    let websiteUrl = formData.website;
    if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
      websiteUrl = `https://${websiteUrl}`;
    }

    setIsCapturingScreenshot(true);
    try {
      console.log('Starting rich data extraction for:', websiteUrl);
      
      const res = await fetch('/api/products/extract-rich-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          websiteUrl: websiteUrl
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product: {product.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Include https:// for best results with screenshot capture
                </p>
              </div>

              <div>
                <Label htmlFor="contact_number">Phone Number</Label>
                <Input
                  id="contact_number"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@example.com"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Location Information</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="location_address">Address Line 1</Label>
                <Input
                  id="location_address"
                  name="location_address"
                  value={formData.location_address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="address_line_2">Address Line 2</Label>
                <Input
                  id="address_line_2"
                  name="address_line_2"
                  value={formData.address_line_2}
                  onChange={handleChange}
                  placeholder="Suite 100"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="mt-1"
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
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input
                    id="zip_code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    placeholder="12345"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Image Management</h3>
            
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                {formData.website && (
                  <>
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
                  </>
                )}
              </div>
              {formData.website && !formData.image_url && (
                <p className="text-sm text-gray-600 mt-2">
                  💡 No image? Use "Capture Screenshot" to automatically capture the website!
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
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
