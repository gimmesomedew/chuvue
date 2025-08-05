"use client";

import { useState, useEffect, useRef } from 'react';
import { ClipboardList, MapPin, Phone, Share2, PawPrint } from 'lucide-react';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
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

  // Google Places Autocomplete - Static libraries array to prevent re-renders
  const libraries = ['places'] as const;
  const { isLoaded: mapsLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
    id: 'google-places-script',
  });

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
      // @ts-expect-error - Google Maps types are incomplete
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
    address_line_2: '',
    city: '',
    state: '',
    zip_code: '',
    latitude: '',
    longitude: '',
    contact_phone: '',
    website_url: '',
    email: '',
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
    setLoading(true);
    try {
      const res = await fetch('/api/service-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user_id: user ? user.id : null }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Submission failed');
      }
      showToast.success('Listing submitted for review!');
      router.push('/submission/confirmation');
      setForm({
        service_type: '', name: '', description: '', address: '', city: '', state: '', zip_code: '', latitude: '', longitude: '', contact_phone: '', website_url: '', email: '', facebook_url: '', instagram_url: '', twitter_url: '', pets_name: '', pet_description: '',
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary py-12 text-center text-white shadow-md">
        <h1 className="text-4xl font-bold mb-2">Add a New Listing</h1>
        <p className="text-lg opacity-90">Share your dog service with our community</p>
      </section>

      {/* Progress Indicator */}
      <nav className="max-w-4xl mx-auto w-full -mt-6 mb-8 px-4">
        <ol className="flex justify-between bg-white shadow rounded-lg p-4">
          {[
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
          ))}
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
              Service Details
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
              <div className="space-y-2 md:col-span-2"><Label>Business Name</Label><Input name="name" placeholder="e.g., Central Bark Dog Park" value={form.name} onChange={handleChange} required /></div>
              <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea name="description" placeholder="Provide a brief description of the service" value={form.description} onChange={handleChange} required /></div>
            </div>
          </section>

          {/* Location */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              Location
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
                        required
                      />
                    </Autocomplete>
                  ) : (
                    <Input name="address" value={form.address} onChange={handleChange} required />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Address Line 2 (Optional)</Label>
                  <Input
                    name="address_line_2"
                    value={form.address_line_2}
                    onChange={handleChange}
                    placeholder="Apt, Suite, Unit, etc."
                  />
                </div>
              </div>
              {/* City, State, Zip in one row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>City</Label><Input name="city" placeholder="City" value={form.city} onChange={handleChange} required /></div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <select name="state" value={form.state} onChange={handleChange} className="select select-bordered w-full h-10" required>
                    <option value="">Select</option>
                    {US_STATES.map((st)=>(<option key={st.abbreviation} value={st.abbreviation}>{st.name}</option>))}
                  </select>
                </div>
                <div className="space-y-2"><Label>Zip Code</Label><Input name="zip_code" placeholder="ZIP" value={form.zip_code} onChange={handleChange} required /></div>
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
              <div className="space-y-2 md:col-span-2"><Label>Website URL</Label><Input name="website_url" placeholder="https://" value={form.website_url} onChange={handleChange} /></div>
            </div>
          </section>

          {/* Social Links */}
          {getSection('showSocial') && (
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

          {/* Pet Information */}
          {getSection('showPetInfo') && (
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
              {loading ? 'Submitting...' : 'Submit Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
} 