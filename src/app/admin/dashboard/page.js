import { query } from '@/lib/db';
import Link from 'next/link';

export const revalidate = 0; // Fresh metrics on each reload

export default function AdminDashboardPage() {
  let stats = {
    states: 0,
    cities: 0,
    donors: 0,
    listedFood: 0,
    allRequests: 0,
    newRequests: 0,
    rejectedRequests: 0,
    completedRequests: 0
  };

  try {
    stats.states = query.get("SELECT COUNT(*) as count FROM states")?.count || 0;
    stats.cities = query.get("SELECT COUNT(*) as count FROM cities")?.count || 0;
    stats.donors = query.get("SELECT COUNT(*) as count FROM users WHERE role = 'donor'")?.count || 0;
    stats.listedFood = query.get("SELECT COUNT(*) as count FROM food_listings")?.count || 0;
    stats.allRequests = query.get("SELECT COUNT(*) as count FROM requests")?.count || 0;
    stats.newRequests = query.get("SELECT COUNT(*) as count FROM requests WHERE status = 'new'")?.count || 0;
    stats.rejectedRequests = query.get("SELECT COUNT(*) as count FROM requests WHERE status = 'rejected'")?.count || 0;
    stats.completedRequests = query.get("SELECT COUNT(*) as count FROM requests WHERE status = 'completed'")?.count || 0;
  } catch (e) {
    console.error('Failed to query dashboard stats:', e);
  }

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', marginBottom: '2rem' }}>Dashboard Overview</h2>
      
      {/* Grid matching the image exactly */}
      <div className="stats-grid">
        {/* State */}
        <Link href="/admin/states" style={{ textDecoration: 'none' }}>
          <div className="stat-card brown">
            <span className="stat-card-title">Total State</span>
            <span className="stat-card-value">{stats.states}</span>
            <span className="stat-card-icon">🗺</span>
          </div>
        </Link>

        {/* City */}
        <Link href="/admin/cities" style={{ textDecoration: 'none' }}>
          <div className="stat-card green">
            <span className="stat-card-title">Total City</span>
            <span className="stat-card-value">{stats.cities}</span>
            <span className="stat-card-icon">🏙</span>
          </div>
        </Link>

        {/* Donors */}
        <Link href="/admin/donors" style={{ textDecoration: 'none' }}>
          <div className="stat-card blue">
            <span className="stat-card-title">Total Food Donor</span>
            <span className="stat-card-value">{stats.donors}</span>
            <span className="stat-card-icon">👥</span>
          </div>
        </Link>

        {/* Listed Food */}
        <Link href="/admin/food-listings" style={{ textDecoration: 'none' }}>
          <div className="stat-card red">
            <span className="stat-card-title">Total Listed Food</span>
            <span className="stat-card-value">{stats.listedFood}</span>
            <span className="stat-card-icon">🍎</span>
          </div>
        </Link>
      </div>

      <div className="stats-grid" style={{ marginTop: '2rem' }}>
        {/* All Requests */}
        <Link href="/admin/requests" style={{ textDecoration: 'none' }}>
          <div className="stat-card dark-gray">
            <span className="stat-card-title">All Requests</span>
            <span className="stat-card-value">{stats.allRequests}</span>
            <span className="stat-card-icon">📁</span>
          </div>
        </Link>

        {/* New Requests */}
        <Link href="/admin/requests?filter=new" style={{ textDecoration: 'none' }}>
          <div className="stat-card gray">
            <span className="stat-card-title">New Requests</span>
            <span className="stat-card-value">{stats.newRequests}</span>
            <span className="stat-card-icon">📄</span>
          </div>
        </Link>

        {/* Rejected Requests */}
        <Link href="/admin/requests?filter=rejected" style={{ textDecoration: 'none' }}>
          <div className="stat-card red">
            <span className="stat-card-title">Rejected Requests</span>
            <span className="stat-card-value">{stats.rejectedRequests}</span>
            <span className="stat-card-icon">❌</span>
          </div>
        </Link>

        {/* Food Take Away Completed */}
        <Link href="/admin/requests?filter=completed" style={{ textDecoration: 'none' }}>
          <div className="stat-card green">
            <span className="stat-card-title">Food Take Away / Request Completed</span>
            <span className="stat-card-value">{stats.completedRequests}</span>
            <span className="stat-card-icon">✅</span>
          </div>
        </Link>
      </div>

      <div style={{ marginTop: '3rem', backgroundColor: 'rgba(30, 36, 40, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <h3 style={{ marginBottom: '1rem', color: '#1cb896' }}>System Welcome</h3>
        <p style={{ lineHeight: '1.6', opacity: 0.9 }}>
          Welcome to the **अन्न सेवा (Anna Seva)** administrative control panel. Use the sidebar menu to coordinate food collections, add states and cities, monitor active food listings, approve/reject incoming claim requests, respond to enquires, and download system activity reports.
        </p>
      </div>
    </div>
  );
}
