'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function DonorRequestsContent() {
  const searchParams = useSearchParams();
  const filterQuery = searchParams.get('filter'); // new, approved, completed

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
      const res = await fetch('/api/requests'); // API automatically filters by logged-in donor
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
        fetchRequests(); // Refresh requests
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
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem' }}>Claims For My Food Listings</h2>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-input"
            style={{ backgroundColor: '#1e2427', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <option value="all">All Claims</option>
            <option value="new">New (Pending Review)</option>
            <option value="approved">Approved (In Progress)</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div style={{ backgroundColor: 'rgba(20, 124, 100, 0.1)', border: '1px solid rgba(20, 124, 100, 0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', opacity: 0.9 }}>
        💡 <strong>Your Authority:</strong> Review incoming requests from individuals or NGOs for food items you listed. You can **Approve** or **Reject** them. Once the requester takes away the food, mark the claim as **Complete** to automatically close the food listing in the system.
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading claim requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>No claim requests found.</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>My Food Item</th>
                <th>Requester Name</th>
                <th>Requester Phone</th>
                <th>Qty Requested</th>
                <th>Reason / Message</th>
                <th>Delivery Location</th>
                <th>Status</th>
                <th>Date Requested</th>
                <th style={{ width: '180px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((r, index) => (
                <tr key={r.id}>
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: 600, color: '#14b8a6' }}>{r.food_items}</td>
                  <td style={{ fontWeight: 600 }}>{r.requester_name}</td>
                  <td>{r.requester_mobile}</td>
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

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '500px', color: 'var(--text-dark)' }}>
            <button className="modal-close" onClick={() => setSelectedRequest(null)}>×</button>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '2px solid var(--primary-teal-light)', paddingBottom: '0.5rem' }}>
              Claim Request Details
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
              <div><strong>Request ID:</strong> #{selectedRequest.id}</div>
              <div><strong>Food Listing:</strong> {selectedRequest.food_items}</div>
              <div><strong>Requester Name:</strong> {selectedRequest.requester_name}</div>
              <div><strong>Requester Phone:</strong> {selectedRequest.requester_mobile}</div>
              <div><strong>Delivery Address:</strong> {selectedRequest.address}</div>
              <div><strong>Location:</strong> {selectedRequest.city_name}, {selectedRequest.state_name}</div>
              <div><strong>Quantity Claimed:</strong> {selectedRequest.quantity}</div>
              <div><strong>Reason / Purpose:</strong> {selectedRequest.reason}</div>
              <div><strong>Status:</strong> <span className={`status-badge ${selectedRequest.status}`}>{selectedRequest.status}</span></div>
              <div><strong>Date Requested:</strong> {selectedRequest.created_at}</div>
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
                  Mark Completed (Food Taken Away)
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

export default function DonorRequestsPage() {
  return (
    <Suspense fallback={<div>Loading query filters...</div>}>
      <DonorRequestsContent />
    </Suspense>
  );
}
