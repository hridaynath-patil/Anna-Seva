'use client';

import { useState, useEffect } from 'react';

export default function AdminSearchPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({
    state_id: '',
    city_id: '',
    search: '',
    status: ''
  });

  useEffect(() => {
    fetchStates();
    // Load initial listings
    fetchListings();
  }, []);

  const fetchStates = async () => {
    try {
      const res = await fetch('/api/states');
      const data = await res.json();
      setStates(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchListings = async (customFilters = filters) => {
    setLoading(true);
    try {
      let url = '/api/food-listings?';
      if (customFilters.state_id) url += `state_id=${customFilters.state_id}&`;
      if (customFilters.city_id) url += `city_id=${customFilters.city_id}&`;
      if (customFilters.search) url += `search=${encodeURIComponent(customFilters.search)}&`;
      if (customFilters.status) url += `status=${customFilters.status}&`;

      const res = await fetch(url);
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    const updatedFilters = { ...filters, state_id: stateId, city_id: '' };
    setFilters(updatedFilters);
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
    fetchListings(updatedFilters);
  };

  const handleChange = (e) => {
    const updatedFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(updatedFilters);
    fetchListings(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = { state_id: '', city_id: '', search: '', status: '' };
    setFilters(resetFilters);
    setCities([]);
    fetchListings(resetFilters);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-row">
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem' }}>Search Listed Food</h2>
      </div>

      {/* Filter panel */}
      <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', alignItems: 'flex-end' }}>
          
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.85rem' }}>Keyword Search</label>
            <input
              type="text"
              name="search"
              placeholder="Food items, contact name..."
              value={filters.search}
              onChange={handleChange}
              className="filter-input"
              style={{ width: '100%', backgroundColor: '#ffffff', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.85rem' }}>State</label>
            <select
              name="state_id"
              value={filters.state_id}
              onChange={handleStateChange}
              className="filter-input"
              style={{ width: '100%', backgroundColor: '#ffffff', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.85rem' }}>City</label>
            <select
              name="city_id"
              value={filters.city_id}
              onChange={handleChange}
              className="filter-input"
              style={{ width: '100%', backgroundColor: '#ffffff', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}
              disabled={!filters.state_id}
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.85rem' }}>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="filter-input"
              style={{ width: '100%', backgroundColor: '#ffffff', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="claimed">Claimed</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <button
            onClick={handleReset}
            className="action-btn view"
            style={{ height: '38px', justifyContent: 'center', fontWeight: '700' }}
          >
            Clear Filters
          </button>

        </div>
      </div>

      {/* Results table */}
      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Searching listings...</div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>No listings matched your criteria.</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>S.NO</th>
                <th>Food Items</th>
                <th>Contact Person</th>
                <th>Location</th>
                <th>Address</th>
                <th>Status</th>
                <th>Date Listed</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l, index) => (
                <tr key={l.id}>
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent-teal-dark)' }}>{l.food_items}</td>
                  <td>{l.contact_person} ({l.mobile})</td>
                  <td>{l.city_name}, {l.state_name}</td>
                  <td>{l.address}</td>
                  <td>
                    <span className={`status-badge ${l.status}`}>{l.status}</span>
                  </td>
                  <td>{l.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
