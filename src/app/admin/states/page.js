'use client';

import { useState, useEffect } from 'react';

export default function AdminStatesPage() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStateName, setNewStateName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const res = await fetch('/api/states');
      const data = await res.json();
      setStates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddState = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newStateName.trim()) return;

    try {
      const res = await fetch('/api/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newStateName })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('State added successfully!');
        setNewStateName('');
        fetchStates();
      } else {
        setError(data.error || 'Failed to add state');
      }
    } catch (err) {
      setError('An error occurred.');
    }
  };

  const handleDeleteState = async (id) => {
    if (!confirm('Are you sure you want to delete this state? This will delete all associated cities and listings.')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/states?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setSuccess('State deleted successfully.');
        fetchStates();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete state.');
      }
    } catch (err) {
      setError('An error occurred.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-row">
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem' }}>Manage States</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* States List Table */}
        <div className="table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading states...</div>
          ) : states.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>No states defined yet.</div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>State Name</th>
                  <th>Created At</th>
                  <th style={{ width: '100px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {states.map((s, index) => (
                  <tr key={s.id}>
                    <td>{index + 1}</td>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td>{s.created_at}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteState(s.id)}
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

        {/* Add State Form */}
        <div style={{ backgroundColor: 'rgba(30, 36, 40, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#1cb896' }}>Add New State</h3>

          {error && (
            <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: 'rgba(245, 61, 86, 0.1)', color: '#ff667a', border: '1px solid rgba(245, 61, 86, 0.2)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: 'rgba(82, 201, 108, 0.1)', color: '#7aff96', border: '1px solid rgba(82, 201, 108, 0.2)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleAddState}>
            <div className="form-group">
              <label htmlFor="stateName" style={{ color: 'white' }}>State Name</label>
              <input
                type="text"
                id="stateName"
                value={newStateName}
                onChange={(e) => setNewStateName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1.5px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: 'white',
                  outline: 'none'
                }}
                required
                placeholder="e.g. Maharashtra"
              />
            </div>
            <button
              type="submit"
              className="action-btn add"
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', justifyContent: 'center' }}
            >
              Add State
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
