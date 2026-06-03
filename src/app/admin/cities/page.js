'use client';

import { useState, useEffect } from 'react';

export default function AdminCitiesPage() {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCity, setNewCity] = useState({ state_id: '', name: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCities();
    fetchStates();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await fetch('/api/cities');
      const data = await res.json();
      setCities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await fetch('/api/states');
      const data = await res.json();
      setStates(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newCity.state_id || !newCity.name.trim()) return;

    try {
      const res = await fetch('/api/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCity)
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('City added successfully!');
        setNewCity({ state_id: '', name: '' });
        fetchCities();
      } else {
        setError(data.error || 'Failed to add city');
      }
    } catch (err) {
      setError('An error occurred.');
    }
  };

  const handleDeleteCity = async (id) => {
    if (!confirm('Are you sure you want to delete this city? This will affect listings configured in this city.')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/cities?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setSuccess('City deleted successfully.');
        fetchCities();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete city.');
      }
    } catch (err) {
      setError('An error occurred.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-row">
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem' }}>Manage Cities</h2>
      </div>

      <div className="responsive-grid-2-1" style={{ gap: '2.5rem', alignItems: 'start' }}>
        {/* Cities Table */}
        <div className="table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading cities...</div>
          ) : cities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>No cities defined yet.</div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>City Name</th>
                  <th>State Name</th>
                  <th>Created At</th>
                  <th style={{ width: '100px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((c, index) => (
                  <tr key={c.id}>
                    <td>{index + 1}</td>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td style={{ color: '#c68d4d' }}>{c.state_name}</td>
                    <td>{c.created_at}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteCity(c.id)}
                        className="action-btn delete"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add City Form */}
        <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-teal-dark)' }}>Add New City</h3>

          {error && (
            <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fee2e2', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #dcfce7', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleAddCity}>
            <div className="form-group">
              <label htmlFor="selectState">Select State</label>
              <select
                id="selectState"
                value={newCity.state_id}
                onChange={(e) => setNewCity({ ...newCity, state_id: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid var(--border-light)',
                  borderRadius: '6px',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
                required
              >
                <option value="">-- Choose State --</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cityName">City Name</label>
              <input
                type="text"
                id="cityName"
                value={newCity.name}
                onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid var(--border-light)',
                  borderRadius: '6px',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
                required
                placeholder="e.g. Kolhapur"
              />
            </div>
            
            <button
              type="submit"
              className="action-btn add"
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', justifyContent: 'center' }}
            >
              Add City
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
