"use client";

import { useState, useEffect, useRef } from 'react';
import { ClipboardList, MapPin, Phone, Share2, PawPrint } from 'lucide-react';
import { Autocomplete } from '@react-google-maps/api';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { showToast } from '@/lib/toast';
import { US_STATES } from '@/lib/states';
import { useRouter } from 'next/navigation';
import { getServiceDefinitions } from '@/lib/services';
import type { ServiceDefinition } from '@/lib/types';
import { getSectionDisplayConfig } from '@/lib/services';
import { attemptGeocoding, getDefaultCoordinates } from '@/lib/geocoding';

export default function AddListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [serviceDefinitions, setServiceDefinitions] = useState<ServiceDefinition[]>([]);

  const { isLoaded: mapsLoaded } = useGoogleMaps();

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceLoaded = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handlePlaceChanged = () => {
    const ac = autocompleteRef.current;
    if (!ac) return;
    const place = ac.getPlace();
    if (!place.address_components) return;

    // Helper to extract component by type and field (long or short)
    const getComponent = (
      type: string,
      field: 'long_name' | 'short_name' = 'long_name'
    ) => {
      const component = place.address_components!.find((c) => c.types.includes(type));
      return component ? component[field] : '';
    };

    const streetNumber = getComponent('street_number');
    const route = getComponent('route');
    const city = getComponent('locality') || getComponent('sublocality') || getComponent('administrative_area_level_2');
    const state = getComponent('administrative_area_level_1', 'short_name');
    const zip = getComponent('postal_code');

    const addressLine = `${streetNumber} ${route}`.trim();

    setForm((prev) => ({
      ...prev,
      address: addressLine || prev.address,
      city: city || prev.city,
      state: state || prev.state,
      zip_code: zip || prev.zip_code,
      latitude: place.geometry?.location?.lat().toString() || prev.latitude,
      longitude: place.geometry?.location?.lng().toString() || prev.longitude,
    }));
  };
  const [form, setForm] = useState({
    service_type: '',
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    latitude: '',
    longitude: '',
    contact_phone: '',
    website_url: '',
    email: '',
    // Product-specific fields
    selectedCategories: [] as number[],
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    pets_name: '',
    pet_description: '',
  });
  const [loading, setLoading] = useState(false);
  const [isLoadingDefinitions, setIsLoadingDefinitions] = useState(true);

  // Fetch service definitions
  useEffect(() => {
    async function loadServiceDefinitions() {
      try {
        const definitions = await getServiceDefinitions();
        setServiceDefinitions(definitions);
      } catch (error) {
        console.error('Error loading service definitions:', error);
        showToast.error('Failed to load service types. Please try again later.');
      } finally {
        setIsLoadingDefinitions(false);
      }
    }
    loadServiceDefinitions();
  }, []);

  // Enhanced auto geocode
  useEffect(() => {
    const { address, city, state, zip_code } = form;
    if (address && city && state && zip_code) {
      const controller = new AbortController();
      const timeout = setTimeout(async () => {
        try {
          const geocoded = await attemptGeocoding(address, city, state, zip_code);
          if (geocoded.success) {
            setForm(f => ({ 
              ...f, 
              latitude: geocoded.latitude!.toString(), 
              longitude: geocoded.longitude!.toString() 
            }));
          } else {
            // Set default coordinates if geocoding fails
            const defaults = getDefaultCoordinates(state);
            setForm(f => ({ 
              ...f, 
              latitude: defaults.latitude.toString(), 
              longitude: defaults.longitude.toString() 
            }));
          }
        } catch (error) {
          console.error('Client-side geocoding error:', error);
          // Set default coordinates on error
          const defaults = getDefaultCoordinates(state);
          setForm(f => ({ 
            ...f, 
            latitude: defaults.latitude.toString(), 
            longitude: defaults.longitude.toString() 
          }));
        }
      }, 800);
      return () => {
        clearTimeout(timeout);
        controller.abort();
      };
    }
  }, [form.address, form.city, form.state, form.zip_code]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate required fields for product submissions
    if (isProductSubmission()) {
      if (!form.name.trim()) {
        showToast.error('Product name is required');
        return;
      }
      if (!form.description.trim()) {
        showToast.error('Product description is required');
        return;
      }
      if (!form.website_url.trim()) {
        showToast.error('Website URL is required');
        return;
      }
      if (form.selectedCategories.length === 0) {
        showToast.error('Please select at least one product category');
        return;
      }
    } else {
      if (!form.address.trim()) {
        showToast.error('Address is required for service listings.');
        return;
      }
      if (!form.city.trim()) {
        showToast.error('City is required for service listings.');
        return;
      }
      if (!form.state.trim()) {
        showToast.error('State is required for service listings.');
        return;
      }
      if (!form.zip_code.trim()) {
        showToast.error('Zip Code is required for service listings.');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      let endpoint = '/api/service-submissions';
      let requestBody = { ...form, user_id: user ? user.id : null };

      if (isProductSubmission()) {
        // Product submission
        endpoint = '/api/product-submissions';
        requestBody = {
          name: form.name,
          description: form.description,
          website: form.website_url,
          contact_number: form.contact_phone,
          email: form.email,
          location_address: form.address,
          city: form.city,
          state: form.state,
          zip_code: form.zip_code,
          latitude: form.latitude,
          longitude: form.longitude,
          selectedCategories: form.selectedCategories,
          user_id: user ? user.id : null
        } as any; // Type assertion to avoid TypeScript errors
      } else {
        // Service submission (existing logic)
        requestBody = { ...form, user_id: user ? user.id : null };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Submission failed');
      }

      const successMessage = isProductSubmission() 
        ? 'Product listing submitted for review!' 
        : 'Service listing submitted for review!';
      
      showToast.success(successMessage);
      router.push('/submission/confirmation');
      
      // Reset form
      setForm({
        service_type: '', 
        name: '', 
        description: '', 
        address: '', 
        city: '', 
        state: '', 
        zip_code: '', 
        latitude: '', 
        longitude: '', 
        contact_phone: '', 
        website_url: '', 
        email: '', 
        selectedCategories: [],
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        pets_name: '',
        pet_description: '',
      });
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  }

  // Section display config loaded from Supabase
  const [sectionDisplayConfig, setSectionDisplayConfig] = useState<Record<string, Record<string, boolean>> | null>(null);
  const [loadingSectionConfig, setLoadingSectionConfig] = useState(true);

  useEffect(() => {
    async function fetchConfig() {
      setLoadingSectionConfig(true);
      const config = await getSectionDisplayConfig();
      setSectionDisplayConfig(config);
      setLoadingSectionConfig(false);
    }
    fetchConfig();
  }, []);

  if (loadingSectionConfig) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">Loading...</div>;
  }

  // Helper to get section config for current type
  const getSection = (section: string) => {
    if (!sectionDisplayConfig) return true;
    const type = form.service_type;
    if (sectionDisplayConfig[type] && sectionDisplayConfig[type][section] !== undefined) {
      return sectionDisplayConfig[type][section];
    }
    // fallback to default (all true)
    return true;
  };

  // Helper to check if current service type is for products
  const isProductSubmission = () => {
    return form.service_type === 'pet_products';
  };

  // Helper to check if current service type is for services
  const isServiceSubmission = () => {
    return form.service_type && form.service_type !== 'pet_products';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary py-12 text-center text-white shadow-md">
        <h1 className="text-4xl font-bold mb-2">Add a New Listing</h1>
        <p className="text-lg opacity-90">
          {isProductSubmission() 
            ? 'Share your pet products with our community' 
            : 'Share your dog service with our community'
          }
        </p>
      </section>

      {/* Progress Indicator */}
      <nav className="max-w-4xl mx-auto w-full -mt-6 mb-8 px-4">
        <ol className="flex justify-between bg-white shadow rounded-lg p-4">
          {(() => {
            if (isProductSubmission()) {
              return [
                { label: 'Product Details', icon: ClipboardList },
                { label: 'Location (Optional)', icon: MapPin },
                { label: 'Contact', icon: Phone },
              ].map(({ label, icon: Icon }) => (
                <li key={label} className="flex-1 flex flex-col items-center text-sm font-medium text-gray-600">
                  <Icon className="w-5 h-5 mb-1 text-secondary" />
                  <span className="hidden sm:inline-block text-center">{label}</span>
                </li>
              ));
            } else {
              return [
                { label: 'Service Details', icon: ClipboardList },
                { label: 'Location', icon: MapPin },
                { label: 'Contact', icon: Phone },
                { label: 'Social', icon: Share2 },
                { label: 'Pet Info', icon: PawPrint },
              ].map(({ label, icon: Icon }) => (
                <li key={label} className="flex-1 flex flex-col items-center text-sm font-medium text-gray-600">
                  <Icon className="w-5 h-5 mb-1 text-secondary" />
                  <span className="hidden sm:inline-block text-center">{label}</span>
                </li>
              ));
            }
          })()}
        </ol>
      </nav>

      {/* Form Card */}
      <div className="flex-1">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-10">
        <form className="space-y-12" onSubmit={handleSubmit}>
          {/* Service Details */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-secondary" />
              {isProductSubmission() ? 'Product Details' : 'Service Details'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Service Type</Label>
                <select 
                  name="service_type" 
                  value={form.service_type} 
                  onChange={handleChange} 
                  className="select select-bordered w-full h-10" 
                  required
                  disabled={isLoadingDefinitions}
                >
                  <option value="">Select type</option>
                  {serviceDefinitions.map((def) => (
                    <option key={def.service_type} value={def.service_type}>
                      {def.service_name}
                    </option>
                  ))}
                </select>
                {isLoadingDefinitions && (
                  <p className="text-sm text-gray-500 mt-1">Loading service types...</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{isProductSubmission() ? 'Product/Business Name' : 'Business Name'}</Label>
                <Input name="name" placeholder={isProductSubmission() ? "e.g., Pawsome Pet Supplies" : "e.g., Central Bark Dog Park"} value={form.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea 
                  name="description" 
                  placeholder={isProductSubmission() ? "Describe your products, services, and what makes your business special" : "Provide a brief description of the service"} 
                  value={form.description} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              {/* Product-specific fields */}
              
              {/* Product Categories */}
              {isProductSubmission() && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Product Categories *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: 1, name: 'Nutritional, Food, Supplements', color: '#10B981' },
                      { id: 2, name: 'Calming', color: '#8B5CF6' },
                      { id: 3, name: 'Immune Support', color: '#F59E0B' },
                      { id: 4, name: 'Multi-Vitamin Supplements', color: '#3B82F6' },
                      { id: 5, name: 'Anti-Inflammatory, Anti-Itch', color: '#EF4444' },
                      { id: 6, name: 'Skin and Wound Care', color: '#EC4899' },
                      { id: 7, name: 'Teeth and Dental Care', color: '#06B6D4' },
                      { id: 8, name: 'Gear', color: '#6366F1' },
                      { id: 9, name: 'Red Light Therapy', color: '#DC2626' },
                      { id: 10, name: 'Other', color: '#6B7280' }
                    ].map((category) => (
                      <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.selectedCategories.includes(category.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForm(prev => ({
                                ...prev,
                                selectedCategories: [...prev.selectedCategories, category.id]
                              }));
                            } else {
                              setForm(prev => ({
                                ...prev,
                                selectedCategories: prev.selectedCategories.filter(id => id !== category.id)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-secondary focus:ring-secondary"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    * Select at least one category that applies to your products
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Location */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              {isProductSubmission() ? 'Location (Optional)' : 'Location'}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Address</Label>
                  {mapsLoaded ? (
                    <Autocomplete onLoad={handlePlaceLoaded} onPlaceChanged={handlePlaceChanged} fields={["address_components","geometry"]}>
                      <Input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Start typing address"
                        autoComplete="off"
                        required={!isProductSubmission()}
                      />
                    </Autocomplete>
                  ) : (
                    <Input name="address" value={form.address} onChange={handleChange} required={!isProductSubmission()} />
                  )}
                </div>
              </div>
              {/* City, State, Zip in one row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>City</Label><Input name="city" placeholder="City" value={form.city} onChange={handleChange} required={!isProductSubmission()} /></div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <select name="state" value={form.state} onChange={handleChange} className="select select-bordered w-full h-10" required={!isProductSubmission()}>
                    <option value="">Select</option>
                    {US_STATES.map((st)=>(<option key={st.abbreviation} value={st.abbreviation}>{st.name}</option>))}
                  </select>
                </div>
                <div className="space-y-2"><Label>Zip Code</Label><Input name="zip_code" placeholder="ZIP" value={form.zip_code} onChange={handleChange} required={!isProductSubmission()} /></div>
              </div>
              {/* latitude & longitude are auto-filled; keep as hidden inputs */}
              <input type="hidden" name="latitude" value={form.latitude} readOnly />
              <input type="hidden" name="longitude" value={form.longitude} readOnly />
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-secondary" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Contact Phone</Label><Input name="contact_phone" placeholder="(555) 123-4567" value={form.contact_phone} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" placeholder="example@domain.com" value={form.email} onChange={handleChange} />
                <p className="text-sm text-gray-500">Optional: Providing an email allows us to create an account so you can manage your listing.</p>
              </div>
              <div className="space-y-2 md:col-span-2"><Label>Website URL *</Label><Input name="website_url" placeholder="https://" value={form.website_url} onChange={handleChange} required /></div>
            </div>
          </section>

          {/* Social Links - Only for services */}
          {!isProductSubmission() && getSection('showSocial') && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-secondary" />
                Social Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Facebook URL</Label><Input name="facebook_url" placeholder="https://facebook.com/..." value={form.facebook_url} onChange={handleChange} /></div>
                <div className="space-y-2"><Label>Instagram URL</Label><Input name="instagram_url" placeholder="https://instagram.com/..." value={form.instagram_url} onChange={handleChange} /></div>
                <div className="space-y-2"><Label>Twitter URL</Label><Input name="twitter_url" placeholder="https://twitter.com/..." value={form.twitter_url} onChange={handleChange} /></div>
              </div>
            </section>
          )}

          {/* Pet Information - Only for services */}
          {!isProductSubmission() && getSection('showPetInfo') && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-secondary" />
                Pet Information (optional)
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2"><Label>Pet&apos;s Name</Label><Input name="pets_name" placeholder="Buddy" value={form.pets_name} onChange={handleChange} /></div>
                <div className="space-y-2"><Label>Pet Description</Label><Textarea name="pet_description" placeholder="Tell us a bit about your pet..." value={form.pet_description} onChange={handleChange} /></div>
              </div>
            </section>
          )}

          <div className="flex justify-end space-x-4">
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={() => router.push('/')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary bg-primary hover:bg-third" 
              disabled={loading || isLoadingDefinitions}
            >
              {loading ? 'Submitting...' : (isProductSubmission() ? 'Submit Product Listing' : 'Submit Service Listing')}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
} 