'use client';

import { useState, useEffect } from 'react';

export default function DonorProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    state_id: '',
    city_id: ''
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch profile and states
    Promise.all([
      fetch('/api/auth/me').then((res) => res.json()),
      fetch('/api/states').then((res) => res.json())
    ])
      .then(([userData, statesData]) => {
        setStates(statesData);
        if (userData.user) {
          setFormData({
            name: userData.user.name || '',
            email: userData.user.email || '',
            mobile: userData.user.mobile || '',
            address: userData.user.address || '',
            state_id: userData.user.state_id || '',
            city_id: userData.user.city_id || ''
          });

          if (userData.user.state_id) {
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
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess('Profile updated successfully!');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px' }}>
      <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', marginBottom: '1.5rem' }}>My Profile Details</h2>

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
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile details...</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'rgba(30, 36, 40, 0.5)', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div className="form-group">
            <label style={{ color: 'white' }}>Email Address (Read-only)</label>
            <input
              type="text"
              value={formData.email}
              disabled
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed', outline: 'none' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name" style={{ color: 'white' }}>Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', outline: 'none' }}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ color: 'white' }}>Mobile Number (Read-only)</label>
            <input
              type="text"
              value={formData.mobile}
              disabled
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed', outline: 'none' }}
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
            <label htmlFor="address" style={{ color: 'white' }}>Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', outline: 'none' }}
              required
            />
          </div>

          <button
            type="submit"
            className="action-btn add"
            style={{ width: '100%', padding: '0.85rem', justifyContent: 'center', fontSize: '1.05rem', fontWeight: 700, backgroundColor: '#107c64' }}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile Details'}
          </button>
        </form>
      )}
    </div>
  );
}
