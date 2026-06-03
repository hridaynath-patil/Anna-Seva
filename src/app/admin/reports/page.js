'use client';

import { useState } from 'react';

export default function AdminReportsPage() {
  // Set default range to last 30 days
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState({ from_date: thirtyDaysAgo, to_date: today });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setReportData(null);

    try {
      const res = await fetch(`/api/reports?from_date=${dateRange.from_date}&to_date=${dateRange.to_date}`);
      const data = await res.json();
      
      if (res.ok) {
        setReportData(data);
      } else {
        setError(data.error || 'Failed to fetch report data.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header-row">
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem' }}>System Reports</h2>
      </div>

      {/* Date filter form */}
      <form onSubmit={handleGenerateReport} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', backgroundColor: 'rgba(30, 36, 40, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ margin: 0, width: '200px' }}>
          <label style={{ color: 'white', fontSize: '0.85rem' }}>From Date</label>
          <input
            type="date"
            value={dateRange.from_date}
            onChange={(e) => setDateRange({ ...dateRange, from_date: e.target.value })}
            className="filter-input"
            style={{ width: '100%', display: 'block', backgroundColor: '#1e2427', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            required
          />
        </div>
        
        <div className="form-group" style={{ margin: 0, width: '200px' }}>
          <label style={{ color: 'white', fontSize: '0.85rem' }}>To Date</label>
          <input
            type="date"
            value={dateRange.to_date}
            onChange={(e) => setDateRange({ ...dateRange, to_date: e.target.value })}
            className="filter-input"
            style={{ width: '100%', display: 'block', backgroundColor: '#1e2427', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            required
          />
        </div>

        <button
          type="submit"
          className="action-btn add"
          style={{ height: '38px', padding: '0 2rem' }}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </form>

      {error && (
        <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: 'rgba(245, 61, 86, 0.1)', color: '#ff667a', border: '1px solid rgba(245, 61, 86, 0.2)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Report display content */}
      {reportData && (
        <div className="animate-fade-in">
          
          {/* Stats Summary Cards */}
          <h3 style={{ marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', color: '#1cb896' }}>Report Metrics</h3>
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '3rem' }}>
            <div className="stat-card blue" style={{ padding: '1.25rem' }}>
              <span className="stat-card-title" style={{ fontSize: '0.8rem' }}>Total Listed Food</span>
              <span className="stat-card-value" style={{ fontSize: '2rem' }}>{reportData.stats.total_listings}</span>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Claimed: {reportData.stats.claimed_listings} | Available: {reportData.stats.available_listings}</div>
            </div>
            
            <div className="stat-card dark-gray" style={{ padding: '1.25rem' }}>
              <span className="stat-card-title" style={{ fontSize: '0.8rem' }}>Total Claim Requests</span>
              <span className="stat-card-value" style={{ fontSize: '2rem' }}>{reportData.stats.total_requests}</span>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>New: {reportData.stats.new_requests}</div>
            </div>

            <div className="stat-card green" style={{ padding: '1.25rem' }}>
              <span className="stat-card-title" style={{ fontSize: '0.8rem' }}>Completed Requests</span>
              <span className="stat-card-value" style={{ fontSize: '2rem' }}>{reportData.stats.completed_requests}</span>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Deliveries successful</div>
            </div>

            <div className="stat-card red" style={{ padding: '1.25rem' }}>
              <span className="stat-card-title" style={{ fontSize: '0.8rem' }}>Rejected Requests</span>
              <span className="stat-card-value" style={{ fontSize: '2rem' }}>{reportData.stats.rejected_requests}</span>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Denied or canceled</div>
            </div>
          </div>

          {/* Listings Table in date range */}
          <h3 style={{ marginBottom: '1.25rem', color: '#c68d4d' }}>Food Listings Created</h3>
          <div className="table-container" style={{ marginBottom: '3rem' }}>
            {reportData.listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>No listings created in this date range.</div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th>Donor</th>
                    <th>Contact Person</th>
                    <th>Food Items</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Date Listed</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.listings.map((l, idx) => (
                    <tr key={l.id}>
                      <td>{idx + 1}</td>
                      <td>{l.donor_name}</td>
                      <td>{l.contact_person}</td>
                      <td style={{ fontWeight: 600 }}>{l.food_items}</td>
                      <td>{l.city_name}, {l.state_name}</td>
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

          {/* Requests Table in date range */}
          <h3 style={{ marginBottom: '1.25rem', color: '#1a7ff7' }}>Food Claims Requested</h3>
          <div className="table-container">
            {reportData.requests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>No requests submitted in this date range.</div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>ID</th>
                    <th>Requester</th>
                    <th>Food Items Claimed</th>
                    <th>Quantity</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Request Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.requests.map((r, idx) => (
                    <tr key={r.id}>
                      <td>{idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{r.requester_name}</td>
                      <td>{r.food_items}</td>
                      <td>{r.quantity}</td>
                      <td>{r.city_name}, {r.state_name}</td>
                      <td>
                        <span className={`status-badge ${r.status}`}>{r.status}</span>
                      </td>
                      <td>{r.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
