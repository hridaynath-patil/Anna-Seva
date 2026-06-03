'use client';

import { useState, useEffect } from 'react';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/enquiries');
      const data = await res.json();
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, currentStatus) => {
    setError('');
    setSuccess('');
    const newStatus = currentStatus === 'new' ? 'read' : 'new';

    try {
      const res = await fetch('/api/enquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (res.ok) {
        setSuccess(`Enquiry marked as ${newStatus}.`);
        fetchEnquiries();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update enquiry status.');
      }
    } catch (err) {
      setError('An error occurred.');
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/enquiries?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setSuccess('Enquiry deleted successfully.');
        fetchEnquiries();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete enquiry.');
      }
    } catch (err) {
      setError('An error occurred.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-row">
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem' }}>Public Enquiries</h2>
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
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>No enquiries found.</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>S.NO</th>
                <th>Sender Name</th>
                <th>Email Address</th>
                <th>Mobile Number</th>
                <th>Message Content</th>
                <th>Date Received</th>
                <th>Status</th>
                <th style={{ width: '180px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e, index) => (
                <tr key={e.id}>
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: 600 }}>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.mobile}</td>
                  <td style={{ whiteSpace: 'pre-wrap', color: '#cbd5e1' }}>{e.message}</td>
                  <td>{e.created_at}</td>
                  <td>
                    <span className={`status-badge ${e.status === 'new' ? 'new' : 'completed'}`}>
                      {e.status === 'new' ? 'Unread' : 'Read'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleMarkAsRead(e.id, e.status)}
                        className={`action-btn ${e.status === 'new' ? 'complete' : 'view'}`}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        {e.status === 'new' ? 'Mark Read' : 'Mark Unread'}
                      </button>
                      <button
                        onClick={() => handleDeleteEnquiry(e.id)}
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
    </div>
  );
}
