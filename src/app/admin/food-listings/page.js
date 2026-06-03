'use client';

import { useState, useEffect } from 'react';

export default function AdminFoodListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/food-listings'); // Admin fetches all status
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!confirm('Are you sure you want to delete this listing? All claims for this listing will be deleted.')) return;
    try {
      const res = await fetch(`/api/food-listings?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedListing(null);
        fetchListings();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredListings = listings.filter(
    (l) =>
      l.food_items.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.city_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header-row">
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem' }}>All Listed Foods</h2>
        <input
          type="text"
          placeholder="Search items or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="filter-input"
          style={{ width: '250px' }}
        />
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading listings...</div>
        ) : filteredListings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>No listed foods found.</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>S.NO</th>
                <th>Donor (Listed By)</th>
                <th>Contact Person</th>
                <th>Food Items</th>
                <th>Address</th>
                <th>State & City</th>
                <th>Status</th>
                <th>Date Listed</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map((l, index) => (
                <tr key={l.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{l.donor_name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{l.donor_email}</div>
                  </td>
                  <td>{l.contact_person} ({l.mobile})</td>
                  <td style={{ fontWeight: 500 }}>{l.food_items}</td>
                  <td>{l.address}</td>
                  <td>{l.city_name}, {l.state_name}</td>
                  <td>
                    <span className={`status-badge ${l.status}`}>{l.status}</span>
                  </td>
                  <td>{l.created_at}</td>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setSelectedListing(l)}
                      className="action-btn view"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteListing(l.id)}
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

      {/* Details Dialog */}
      {selectedListing && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '500px', color: 'var(--text-dark)' }}>
            <button className="modal-close" onClick={() => setSelectedListing(null)}>×</button>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '2px solid var(--primary-teal-light)', paddingBottom: '0.5rem' }}>
              Food Listing Details
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
              <div><strong>Listing ID:</strong> #{selectedListing.id}</div>
              <div><strong>Food Items:</strong> {selectedListing.food_items}</div>
              <div><strong>Description:</strong> {selectedListing.description || 'No description provided.'}</div>
              <div><strong>Status:</strong> <span className={`status-badge ${selectedListing.status}`}>{selectedListing.status}</span></div>
              <hr style={{ opacity: 0.2 }} />
              <div><strong>Listed By:</strong> {selectedListing.donor_name} ({selectedListing.donor_email})</div>
              <div><strong>Contact Person:</strong> {selectedListing.contact_person}</div>
              <div><strong>Contact Phone:</strong> {selectedListing.mobile}</div>
              <div><strong>Address:</strong> {selectedListing.address}</div>
              <div><strong>Location:</strong> {selectedListing.city_name}, {selectedListing.state_name}</div>
              <div><strong>Listed On:</strong> {selectedListing.created_at}</div>
            </div>
            <button
              onClick={() => handleDeleteListing(selectedListing.id)}
              className="action-btn reject"
              style={{ width: '100%', padding: '0.75rem', marginTop: '1.5rem', justifyContent: 'center' }}
            >
              Delete Listing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
