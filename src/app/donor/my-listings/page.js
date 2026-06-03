'use client';

import { useState, useEffect } from 'react';

export default function DonorMyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  
  // Edit listing state
  const [editForm, setEditForm] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMyListings();
    fetchStates();
  }, []);

  const fetchMyListings = async () => {
    try {
      const res = await fetch('/api/food-listings?my_listings=true');
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
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

  const handleEditClick = async (listing) => {
    setEditForm({ ...listing });
    setEditError('');
    setEditSuccess('');
    
    // Load cities for the listing's state
    try {
      const res = await fetch(`/api/cities?state_id=${listing.state_id}`);
      const data = await res.json();
      setCities(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setEditForm((prev) => ({ ...prev, state_id: stateId, city_id: '' }));
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setEditError('');
    setEditSuccess('');

    try {
      const res = await fetch('/api/food-listings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (res.ok) {
        setEditSuccess('Listing updated successfully!');
        setTimeout(() => {
          setEditForm(null);
          fetchMyListings();
        }, 1500);
      } else {
        const data = await res.json();
        setEditError(data.error || 'Failed to update listing.');
      }
    } catch (err) {
      setEditError('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!confirm('Are you sure you want to delete this listing? All claims for this food will be lost.')) return;
    try {
      const res = await fetch(`/api/food-listings?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMyListings();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-row">
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem' }}>My Listed Foods</h2>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading listings...</div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>You have not listed any food items yet.</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>S.NO</th>
                <th>Food Items</th>
                <th>Contact Details</th>
                <th>Address</th>
                <th>Location</th>
                <th>Status</th>
                <th>Date Listed</th>
                <th style={{ width: '180px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l, index) => (
                <tr key={l.id}>
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: 600, color: '#14b8a6' }}>{l.food_items}</td>
                  <td>{l.contact_person} ({l.mobile})</td>
                  <td>{l.address}</td>
                  <td>{l.city_name}, {l.state_name}</td>
                  <td>
                    <span className={`status-badge ${l.status}`}>{l.status}</span>
                  </td>
                  <td>{l.created_at}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEditClick(l)}
                        className="action-btn view"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', backgroundColor: '#107c64' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteListing(l.id)}
                        className="action-btn delete"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Listing Modal */}
      {editForm && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ color: 'var(--text-dark)' }}>
            <button className="modal-close" onClick={() => setEditForm(null)}>×</button>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary-teal-light)', paddingBottom: '0.5rem' }}>
              Edit Food Listing
            </h2>

            {editError && (
              <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {editError}
              </div>
            )}
            {editSuccess && (
              <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {editSuccess}
              </div>
            )}

            <form onSubmit={handleEditSubmit}>
              <div className="responsive-grid-2col">
                <div className="form-group">
                  <label htmlFor="edit_contact">Contact Person</label>
                  <input
                    type="text"
                    id="edit_contact"
                    value={editForm.contact_person}
                    onChange={(e) => setEditForm({ ...editForm, contact_person: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit_mobile">Contact Mobile</label>
                  <input
                    type="tel"
                    id="edit_mobile"
                    value={editForm.mobile}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    className="form-input"
                    required
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit_items">Food Items</label>
                <input
                  type="text"
                  id="edit_items"
                  value={editForm.food_items}
                  onChange={(e) => setEditForm({ ...editForm, food_items: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit_desc">Description</label>
                <textarea
                  id="edit_desc"
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="form-textarea"
                  rows="2"
                />
              </div>

              <div className="responsive-grid-2col">
                <div className="form-group">
                  <label htmlFor="edit_state">State</label>
                  <select
                    id="edit_state"
                    value={editForm.state_id}
                    onChange={handleStateChange}
                    className="form-select"
                    required
                  >
                    {states.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit_city">City</label>
                  <select
                    id="edit_city"
                    value={editForm.city_id}
                    onChange={(e) => setEditForm({ ...editForm, city_id: e.target.value })}
                    className="form-select"
                    required
                  >
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="edit_address">Address</label>
                <input
                  type="text"
                  id="edit_address"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <button
                type="submit"
                className="form-submit-btn"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Update Listing'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
