'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function AdminRequestsContent() {
  const searchParams = useSearchParams();
  const filterQuery = searchParams.get('filter'); // new, rejected, completed

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState(filterQuery || 'all');

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (filterQuery) {
      setStatusFilter(filterQuery);
    }
  }, [filterQuery]);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/requests');
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (res.ok) {
        setSelectedRequest(null);
        fetchRequests();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredRequests = requests.filter(
    (r) => statusFilter === 'all' || r.status === statusFilter
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header-row">
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem' }}>Food Claim Requests</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-input"
            style={{ backgroundColor: '#1e2427', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>No requests found.</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>Food Item</th>
                <th>Requester</th>
                <th>Qty Requested</th>
                <th>Reason</th>
                <th>Location</th>
                <th>Status</th>
                <th>Request Date</th>
                <th style={{ width: '180px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((r, index) => (
                <tr key={r.id}>
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: 600 }}>{r.food_items}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#1a7ff7' }}>{r.requester_name}</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Phone: {r.requester_mobile}</div>
                  </td>
                  <td>{r.quantity}</td>
                  <td>{r.reason}</td>
                  <td>{r.city_name}, {r.state_name}</td>
                  <td>
                    <span className={`status-badge ${r.status}`}>{r.status}</span>
                  </td>
                  <td>{r.created_at}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        onClick={() => setSelectedRequest(r)}
                        className="action-btn view"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        Details
                      </button>
                      
                      {r.status === 'new' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(r.id, 'approved')}
                            className="action-btn approve"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(r.id, 'rejected')}
                            className="action-btn reject"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {r.status === 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'completed')}
                          className="action-btn complete"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details modal */}
      {selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '500px', color: 'var(--text-dark)' }}>
            <button className="modal-close" onClick={() => setSelectedRequest(null)}>×</button>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '2px solid var(--primary-teal-light)', paddingBottom: '0.5rem' }}>
              Request Details
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
              <div><strong>Request ID:</strong> #{selectedRequest.id}</div>
              <div><strong>Food Listing:</strong> {selectedRequest.food_items}</div>
              <div><strong>Requester Name:</strong> {selectedRequest.requester_name}</div>
              <div><strong>Requester Phone:</strong> {selectedRequest.requester_mobile}</div>
              <div><strong>Delivery Address:</strong> {selectedRequest.address}</div>
              <div><strong>Location:</strong> {selectedRequest.city_name}, {selectedRequest.state_name}</div>
              <div><strong>Quantity Requested:</strong> {selectedRequest.quantity}</div>
              <div><strong>Reason for claim:</strong> {selectedRequest.reason}</div>
              <div><strong>Current Status:</strong> <span className={`status-badge ${selectedRequest.status}`}>{selectedRequest.status}</span></div>
              <div><strong>Requested On:</strong> {selectedRequest.created_at}</div>
              <hr style={{ opacity: 0.2 }} />
              <div><strong>Donor Contact Info:</strong> {selectedRequest.donor_contact} ({selectedRequest.donor_mobile})</div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              {selectedRequest.status === 'new' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'approved')}
                    className="action-btn approve"
                    style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
                  >
                    Approve Request
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'rejected')}
                    className="action-btn reject"
                    style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
                  >
                    Reject Request
                  </button>
                </>
              )}
              {selectedRequest.status === 'approved' && (
                <button
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'completed')}
                  className="action-btn complete"
                  style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
                >
                  Mark Taken Away / Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Suspense } from 'react';

export default function AdminRequestsPage() {
  return (
    <Suspense fallback={<div>Loading queries...</div>}>
      <AdminRequestsContent />
    </Suspense>
  );
}
