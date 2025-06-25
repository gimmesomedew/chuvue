"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { showToast } from '@/lib/toast';
import { US_STATES } from '@/lib/states';
import { useRouter } from 'next/navigation';

const serviceTypes = [
  { value: 'dog_park', label: 'Dog Park' },
  { value: 'groomer', label: 'Groomer' },
  { value: 'trainer', label: 'Trainer' },
  { value: 'veterinarian', label: 'Veterinarian' },
  { value: 'daycare', label: 'Daycare' },
];

export default function AddListingPage() {
  const { user } = useAuth();
  const router = useRouter();
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
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    pets_name: '',
    pet_description: '',
  });
  const [loading, setLoading] = useState(false);

  // Auto geocode
  useEffect(() => {
    const { address, city, state, zip_code } = form;
    if (address && city && state && zip_code) {
      const query = `${address}, ${city}, ${state} ${zip_code}`;
      const controller = new AbortController();
      const timeout = setTimeout(async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`, { signal: controller.signal, headers: { 'User-Agent': 'dog-services-directory' }});
          if (!res.ok) return;
          const data = await res.json();
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            setForm(f => ({ ...f, latitude: lat, longitude: lon }));
          }
        } catch {}
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

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-6">Add a New Listing</h1>
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Service Details */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Service Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Service Type</Label>
                <select name="service_type" value={form.service_type} onChange={handleChange} className="select select-bordered w-full" required>
                  <option value="">Select type</option>
                  {serviceTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2"><Label>Business Name</Label><Input name="name" placeholder="e.g., Central Bark Dog Park" value={form.name} onChange={handleChange} required /></div>
              <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea name="description" placeholder="Provide a brief description of the service" value={form.description} onChange={handleChange} required /></div>
            </div>
          </section>

          {/* Location */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2"><Label>Address</Label><Input name="address" value={form.address} onChange={handleChange} required /></div>
              {/* City, State, Zip in one row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>City</Label><Input name="city" placeholder="City" value={form.city} onChange={handleChange} required /></div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <select name="state" value={form.state} onChange={handleChange} className="select select-bordered w-full" required>
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
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Contact Phone</Label><Input name="contact_phone" placeholder="(555) 123-4567" value={form.contact_phone} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" placeholder="example@domain.com" value={form.email} onChange={handleChange} required /></div>
              <div className="space-y-2 md:col-span-2"><Label>Website URL</Label><Input name="website_url" placeholder="https://" value={form.website_url} onChange={handleChange} /></div>
            </div>
          </section>

          {/* Social Links */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Facebook URL</Label><Input name="facebook_url" placeholder="https://facebook.com/..." value={form.facebook_url} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>Instagram URL</Label><Input name="instagram_url" placeholder="https://instagram.com/..." value={form.instagram_url} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>Twitter URL</Label><Input name="twitter_url" placeholder="https://twitter.com/..." value={form.twitter_url} onChange={handleChange} /></div>
            </div>
          </section>

          {/* Pet Information */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Pet Information (optional)</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2"><Label>Pet's Name</Label><Input name="pets_name" placeholder="Buddy" value={form.pets_name} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>Pet Description</Label><Textarea name="pet_description" placeholder="Tell us a bit about your pet..." value={form.pet_description} onChange={handleChange} /></div>
            </div>
          </section>

          <div className="flex justify-end">
            <button className="btn btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit Listing'}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 