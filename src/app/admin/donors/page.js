'use client';

import { useState, useEffect } from 'react';

export default function AdminDonorsPage() {
  const [donors, setDonors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const res = await fetch('/api/donors');
      const data = await res.json();
      setDonors(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/donors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });

      if (res.ok) {
        setSuccess(`Donor status updated to ${status} successfully.`);
        fetchDonors();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update donor status.');
      }
    } catch (err) {
      setError('An error occurred.');
    }
  };

  const handleDeleteDonor = async (id) => {
    if (!confirm('Are you sure you want to delete this donor? All listings and requests associated with this donor will be removed.')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/donors?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setSuccess('Donor deleted successfully.');
        fetchDonors();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete donor.');
      }
    } catch (err) {
      setError('An error occurred.');
    }
  };

  const filteredDonors = donors.filter(
    (donor) =>
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (donor.mobile && donor.mobile.includes(searchQuery))
  );

  const getStatusBadge = (status) => {
    let styles = {};
    switch (status) {
      case 'approved':
        styles = { color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.2)' };
        break;
      case 'rejected':
        styles = { color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.2)' };
        break;
      default:
        styles = { color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.2)' };
    }
    return (
      <span style={{
        padding: '0.25rem 0.6rem',
        borderRadius: '50px',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'inline-block',
        textAlign: 'center',
        ...styles
      }}>
        {status || 'pending'}
      </span>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-row">
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem' }}>Registered Food Donors</h2>
        <div>
          <input
            type="text"
            placeholder="Search by Name/Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
            style={{ width: '250px' }}
          />
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: 'rgba(245, 61, 86, 0.1)', color: '#ff667a', border: '1px solid rgba(245, 61, 86, 0.2)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: 'rgba(82, 201, 108, 0.1)', color: '#7aff96', border: '1px solid rgba(82, 201, 108, 0.2)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {success}
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading donors list...</div>
        ) : filteredDonors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>No donors found matching query.</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>S.NO</th>
                <th>Donor Name</th>
                <th>Email Address</th>
                <th>Mobile Number</th>
                <th>Address</th>
                <th>State Name</th>
                <th>City Name</th>
                <th>Status</th>
                <th>Registration Date</th>
                <th style={{ width: '200px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.map((donor, index) => (
                <tr key={donor.id}>
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: 600, color: '#1a7ff7' }}>{donor.name}</td>
                  <td>{donor.email}</td>
                  <td>{donor.mobile || 'N/A'}</td>
                  <td>{donor.address || 'N/A'}</td>
                  <td>{donor.state_name || 'N/A'}</td>
                  <td>{donor.city_name || 'N/A'}</td>
                  <td>{getStatusBadge(donor.status)}</td>
                  <td>{donor.created_at}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {donor.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(donor.id, 'approved')}
                          className="action-btn approve"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        >
                          Approve
                        </button>
                      )}
                      {donor.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(donor.id, 'rejected')}
                          className="action-btn reject"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteDonor(donor.id)}
                        className="action-btn delete"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
