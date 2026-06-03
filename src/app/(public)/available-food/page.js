'use client';

import { useState, useEffect } from 'react';

export default function AvailableFoodPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  
  // Filter states
  const [filterStateId, setFilterStateId] = useState('');
  const [filterCityId, setFilterCityId] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterStates, setFilterStates] = useState([]);
  const [filterCities, setFilterCities] = useState([]);

  // Form states for Claim Request
  const [requestForm, setRequestForm] = useState({
    requester_name: '',
    requester_mobile: '',
    address: '',
    state_id: '',
    city_id: '',
    reason: '',
    quantity: ''
  });
  const [claimStates, setClaimStates] = useState([]);
  const [claimCities, setClaimCities] = useState([]);
  const [requestStatus, setRequestStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchListings();
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const res = await fetch('/api/states');
      const data = await res.json();
      setFilterStates(data);
      setClaimStates(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchListings = async (stateId = '', cityId = '', search = '') => {
    setLoading(true);
    try {
      let url = '/api/food-listings?status=available&';
      if (stateId) url += `state_id=${stateId}&`;
      if (cityId) url += `city_id=${cityId}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;
      
      const res = await fetch(url);
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterStateChange = async (e) => {
    const stateId = e.target.value;
    setFilterStateId(stateId);
    setFilterCityId('');
    setFilterCities([]);
    fetchListings(stateId, '', filterSearch);

    if (stateId) {
      try {
        const res = await fetch(`/api/cities?state_id=${stateId}`);
        const data = await res.json();
        setFilterCities(data);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleFilterCityChange = (e) => {
    const cityId = e.target.value;
    setFilterCityId(cityId);
    fetchListings(filterStateId, cityId, filterSearch);
  };

  const handleFilterSearchChange = (e) => {
    const search = e.target.value;
    setFilterSearch(search);
    // Debounce or filter on click? Let's query as they type or on hit
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings(filterStateId, filterCityId, filterSearch);
  };

  const handleResetFilters = () => {
    setFilterStateId('');
    setFilterCityId('');
    setFilterSearch('');
    setFilterCities([]);
    fetchListings('', '', '');
  };

  const handleClaimStateChange = async (e) => {
    const stateId = e.target.value;
    setRequestForm((prev) => ({ ...prev, state_id: stateId, city_id: '' }));
    setClaimCities([]);

    if (stateId) {
      try {
        const res = await fetch(`/api/cities?state_id=${stateId}`);
        const data = await res.json();
        setClaimCities(data);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openRequestModal = (listing) => {
    setSelectedListing(listing);
    setRequestForm({
      requester_name: '',
      requester_mobile: '',
      address: '',
      state_id: '',
      city_id: '',
      reason: '',
      quantity: ''
    });
    setRequestStatus({ type: '', message: '' });
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setRequestStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: selectedListing.id,
          ...requestForm
        })
      });

      const data = await res.json();

      if (res.ok) {
        setRequestStatus({ type: 'success', message: 'Your claim request has been submitted successfully. The donor will review and approve.' });
        setTimeout(() => {
          setSelectedListing(null);
          fetchListings(filterStateId, filterCityId, filterSearch); // Refresh lists
        }, 3000);
      } else {
        setRequestStatus({ type: 'error', message: data.error || 'Failed to submit request.' });
      }
    } catch (err) {
      setRequestStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="public-container animate-fade-in">
      <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '2rem', marginBottom: '3rem' }}>
        <span style={{ color: 'var(--accent-teal)', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>SURPLUS DISTRIBUTION NETWORK</span>
        <h1 style={{ fontSize: '2.75rem', fontFamily: 'var(--font-title)', fontWeight: 800, marginTop: '0.25rem' }}>
          Available Food Directory
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', maxWidth: '800px' }}>
          Browse the active list of surplus food batches listed by verified donors. NGOs, community kitchens, and coordinators can submit direct claim requests for distribution.
        </p>
      </div>

      {/* Directory Search Filters Panel */}
      <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'flex-end', backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-light)', marginBottom: '3rem' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-navy-light)' }}>Search Keywords</label>
          <input
            type="text"
            placeholder="e.g. Rice, Dal, Chapati..."
            value={filterSearch}
            onChange={handleFilterSearchChange}
            className="form-input"
            style={{ backgroundColor: 'white' }}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-navy-light)' }}>State</label>
          <select
            value={filterStateId}
            onChange={handleFilterStateChange}
            className="form-select"
            style={{ backgroundColor: 'white' }}
          >
            <option value="">All States</option>
            {filterStates.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-navy-light)' }}>City</label>
          <select
            value={filterCityId}
            onChange={handleFilterCityChange}
            className="form-select"
            style={{ backgroundColor: 'white' }}
            disabled={!filterStateId}
          >
            <option value="">All Cities</option>
            {filterCities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="submit"
            className="form-submit-btn"
            style={{ margin: 0, padding: '0.8rem', flex: 2 }}
          >
            Filter
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="action-btn view"
            style={{ height: '46px', flex: 1, justifyContent: 'center', backgroundColor: '#e2e8f0', color: 'var(--primary-navy)', border: 'none' }}
          >
            Reset
          </button>
        </div>
      </form>

      {/* Directory Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading food catalog...</div>
      ) : listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-light)', color: 'var(--text-muted)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-navy)' }}>No matching food items.</h3>
          <p>Try resetting the search filters or check back later.</p>
        </div>
      ) : (
        <div className="public-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>S.NO</th>
                <th>Contact</th>
                <th>Food Description</th>
                <th>Collection Address</th>
                <th>Location</th>
                <th>Status</th>
                <th>Date Cataloged</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing, index) => {
                const [datePart, timePart] = listing.created_at ? listing.created_at.split(' ') : ['', ''];
                return (
                  <tr key={listing.id}>
                    <td style={{ fontWeight: 700, textAlign: 'center', color: 'var(--accent-teal)' }}>{index + 1}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>{listing.contact_person}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{listing.mobile}</div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>{listing.food_items}</td>
                    <td style={{ fontSize: '0.85rem', lineHeight: '1.4', maxWidth: '220px' }}>{listing.address}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{listing.city_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{listing.state_name}</div>
                    </td>
                    <td>
                      {listing.status === 'approved' ? (
                        <span className="status-badge approved" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)' }}>Request Approved</span>
                      ) : listing.status === 'claimed' ? (
                        <span className="status-badge completed" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>Request Completed</span>
                      ) : (
                        <span className="status-badge available">Available</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      <div>{datePart}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{timePart}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {listing.status === 'approved' ? (
                        <button
                          className="form-submit-btn"
                          style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem', width: 'auto', margin: 0, backgroundColor: '#cbd5e1', color: '#64748b', cursor: 'not-allowed', boxShadow: 'none' }}
                          disabled
                        >
                          Claimed
                        </button>
                      ) : listing.status === 'claimed' ? (
                        <button
                          className="form-submit-btn"
                          style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem', width: 'auto', margin: 0, backgroundColor: '#e2e8f0', color: '#94a3b8', cursor: 'not-allowed', boxShadow: 'none' }}
                          disabled
                        >
                          Completed
                        </button>
                      ) : (
                        <button
                          onClick={() => openRequestModal(listing)}
                          className="form-submit-btn"
                          style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem', width: 'auto', margin: 0 }}
                        >
                          Claim Food
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Claim Modal */}
      {selectedListing && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <button className="modal-close" onClick={() => setSelectedListing(null)}>×</button>
            
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-navy)', marginBottom: '1.25rem', borderBottom: '2px solid var(--accent-teal-light)', paddingBottom: '0.5rem', fontWeight: 800 }}>
              Food Package Claims
            </h2>

            {/* Food Info Summary */}
            <div className="modal-food-summary" style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem', border: '1px solid var(--border-light)' }}>
              <div><strong>Food Items:</strong> <span style={{ color: 'var(--accent-teal-dark)', fontWeight: 700 }}>{selectedListing.food_items}</span></div>
              <div><strong>Contact Donor:</strong> {selectedListing.contact_person}</div>
              <div><strong>Phone Number:</strong> {selectedListing.mobile}</div>
              <div><strong>Location:</strong> {selectedListing.city_name}, {selectedListing.state_name}</div>
              <div style={{ gridColumn: 'span 2' }}><strong>Address:</strong> {selectedListing.address}</div>
              {selectedListing.description && (
                <div style={{ gridColumn: 'span 2' }}><strong>Additional Info:</strong> {selectedListing.description}</div>
              )}
              <div style={{ gridColumn: 'span 2', fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>Listed On:</strong> {selectedListing.created_at}</div>
            </div>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--primary-navy)', fontWeight: 700 }}>Submit Allocation Request</h3>

            {requestStatus.message && (
              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                backgroundColor: requestStatus.type === 'success' ? '#f0fdfa' : '#fef2f2',
                color: requestStatus.type === 'success' ? '#0f766e' : '#991b1b',
                border: `1px solid ${requestStatus.type === 'success' ? '#ccfbf1' : '#fecaca'}`,
                fontWeight: 600,
                fontSize: '0.92rem'
              }}>
                {requestStatus.message}
              </div>
            )}

            <form onSubmit={handleRequestSubmit}>
              <div className="responsive-grid-2col">
                <div className="form-group">
                  <label htmlFor="req_name">NGO / Recipient Organization Name</label>
                  <input
                    type="text"
                    id="req_name"
                    value={requestForm.requester_name}
                    onChange={(e) => setRequestForm({...requestForm, requester_name: e.target.value})}
                    className="form-input"
                    required
                    placeholder="e.g. V.S. Patil Charitable Trust"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="req_mobile">Recipient Mobile Number</label>
                  <input
                    type="tel"
                    id="req_mobile"
                    value={requestForm.requester_mobile}
                    onChange={(e) => setRequestForm({...requestForm, requester_mobile: e.target.value})}
                    className="form-input"
                    required
                    placeholder="10-digit mobile"
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>

              <div className="responsive-grid-2col">
                <div className="form-group">
                  <label htmlFor="req_state">State</label>
                  <select
                    id="req_state"
                    value={requestForm.state_id}
                    onChange={handleClaimStateChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select State</option>
                    {claimStates.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="req_city">City</label>
                  <select
                    id="req_city"
                    value={requestForm.city_id}
                    onChange={(e) => setRequestForm({...requestForm, city_id: e.target.value})}
                    className="form-select"
                    required
                    disabled={!requestForm.state_id}
                  >
                    <option value="">Select City</option>
                    {claimCities.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="req_address">Delivery/Drop-off Address</label>
                <input
                  type="text"
                  id="req_address"
                  value={requestForm.address}
                  onChange={(e) => setRequestForm({...requestForm, address: e.target.value})}
                  className="form-input"
                  required
                  placeholder="Address details for collection"
                />
              </div>

              <div className="responsive-grid-2-1">
                <div className="form-group">
                  <label htmlFor="req_reason">Claim Justification / Reason</label>
                  <input
                    type="text"
                    id="req_reason"
                    value={requestForm.reason}
                    onChange={(e) => setRequestForm({...requestForm, reason: e.target.value})}
                    className="form-input"
                    required
                    placeholder="e.g. Free dinner feeding drive in local slum"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="req_qty">Quantity Requested</label>
                  <input
                    type="text"
                    id="req_qty"
                    value={requestForm.quantity}
                    onChange={(e) => setRequestForm({...requestForm, quantity: e.target.value})}
                    className="form-input"
                    required
                    placeholder="e.g. 20 packs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="form-submit-btn"
                disabled={submitting}
                style={{ marginTop: '0.75rem' }}
              >
                {submitting ? 'Submitting Allocation Request...' : 'Confirm Allocation Claim'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
