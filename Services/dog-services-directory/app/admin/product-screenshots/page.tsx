import { ProductScreenshotManager } from '@/components/admin/ProductScreenshotManager';

// Mock product data for demonstration
const mockProduct = {
  id: 1,
  name: 'DogSol',
  description: 'Premium dog supplement for joint health and mobility',
  website: 'https://www.dogsol.com',
  contact_number: '555-0123',
  email: 'info@dogsol.com',
  location_address: '123 Pet Health Ave',
  city: 'Indianapolis',
  state: 'IN',
  zip_code: '46240',
  latitude: 39.7684,
  longitude: -86.1581,
  is_verified_gentle_care: true,
  created_at: '2025-01-15T00:00:00Z',
  updated_at: '2025-01-15T00:00:00Z',
  categories: [
    {
      id: 1,
      name: 'Supplements',
      description: 'Health and wellness supplements',
      color: '#10B981',
      created_at: '2025-01-15T00:00:00Z'
    }
  ]
};

export default function ProductScreenshotsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Screenshot Management
          </h1>
          <p className="text-gray-600">
            Administrators and reviewers can capture and manage website screenshots for products.
          </p>
        </div>

        <div className="grid gap-6">
          <ProductScreenshotManager product={mockProduct} />
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              How It Works
            </h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">1</span>
                </div>
                <p>When a product has a website URL, administrators can capture a screenshot</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">2</span>
                </div>
                <p>The screenshot is automatically saved and displayed on the product card</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">3</span>
                </div>
                <p>Screenshots can be refreshed to capture updated website content</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-600 text-xs font-medium">!</span>
              </div>
              <div>
                <h3 className="font-medium text-yellow-800 mb-1">Admin Access Required</h3>
                <p className="text-yellow-700 text-sm">
                  This screenshot functionality is restricted to administrators and reviewers only. 
                  Regular users will see the screenshots but cannot capture new ones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
