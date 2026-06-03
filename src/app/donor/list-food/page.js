'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DonorListFoodPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    contact_person: '',
    mobile: '',
    food_items: '',
    description: '',
    address: '',
    state_id: '',
    city_id: ''
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch states and current donor info
    Promise.all([
      fetch('/api/states').then((res) => res.json()),
      fetch('/api/auth/me').then((res) => res.json())
    ])
      .then(([statesData, userData]) => {
        setStates(statesData);
        if (userData.user) {
          setFormData((prev) => ({
            ...prev,
            contact_person: userData.user.name,
            mobile: userData.user.mobile || '',
            address: userData.user.address || '',
            state_id: userData.user.state_id || '',
            city_id: userData.user.city_id || ''
          }));
          
          if (userData.user.state_id) {
            // Load initial cities for user's state
            fetch(`/api/cities?state_id=${userData.user.state_id}`)
              .then((res) => res.json())
              .then((citiesData) => setCities(citiesData));
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setFormData((prev) => ({ ...prev, state_id: stateId, city_id: '' }));
    setCities([]);

    if (stateId) {
      try {
        const res = await fetch(`/api/cities?state_id=${stateId}`);
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/food-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Surplus food listing created successfully!');
        // Keep name, mobile, address, state, city but clear food-specific details
        setFormData((prev) => ({
          ...prev,
          food_items: '',
          description: ''
        }));
        setTimeout(() => {
          router.push('/donor/my-listings');
        }, 2000);
      } else {
        setError(data.error || 'Failed to create listing.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px' }}>
      <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', marginBottom: '1.5rem' }}>List Surplus Food</h2>

      {error && (
        <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: 'rgba(245, 61, 86, 0.1)', color: '#ff667a', border: '1px solid rgba(245, 61, 86, 0.2)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: 'rgba(82, 201, 108, 0.1)', color: '#7aff96', border: '1px solid rgba(82, 201, 108, 0.2)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          {success}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading form details...</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'rgba(30, 36, 40, 0.5)', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="contact_person" style={{ color: 'white' }}>Contact Person Name</label>
              <input
                type="text"
                id="contact_person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', outline: 'none' }}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="mobile" style={{ color: 'white' }}>Contact Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', outline: 'none' }}
                required
                pattern="[0-9]{10}"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="food_items" style={{ color: 'white' }}>Food Items Name (Comma-separated)</label>
            <input
              type="text"
              id="food_items"
              name="food_items"
              value={formData.food_items}
              onChange={handleChange}
              placeholder="e.g. Rice, Dal, Mixed Veg, Chapati"
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', outline: 'none' }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" style={{ color: 'white' }}>Description / Expiry Info (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="e.g. Prepared for 20 people. Good for 6 hours."
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', outline: 'none', fontFamily: 'var(--font-body)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="state_id" style={{ color: 'white' }}>State</label>
              <select
                id="state_id"
                name="state_id"
                value={formData.state_id}
                onChange={handleStateChange}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1e2427', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', outline: 'none' }}
                required
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="city_id" style={{ color: 'white' }}>City</label>
              <select
                id="city_id"
                name="city_id"
                value={formData.city_id}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1e2427', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', outline: 'none' }}
                required
                disabled={!formData.state_id}
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="address" style={{ color: 'white' }}>Collection Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', outline: 'none' }}
              required
              placeholder="Address where food is located"
            />
          </div>

          <button
            type="submit"
            className="action-btn add"
            style={{ width: '100%', padding: '0.85rem', justifyContent: 'center', fontSize: '1.05rem', fontWeight: 700, backgroundColor: '#107c64' }}
            disabled={submitting}
          >
            {submitting ? 'Creating Listing...' : 'Publish Food Listing'}
          </button>
        </form>
      )}
    </div>
  );
}
