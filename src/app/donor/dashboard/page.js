import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

export const revalidate = 0; // Fresh statistics on load

export default async function DonorDashboardPage() {
  const session = await getSession();

  let stats = {
    totalListings: 0,
    activeListings: 0,
    totalRequests: 0,
    newRequests: 0,
    approvedRequests: 0,
    completedRequests: 0
  };

  try {
    stats.totalListings = query.get(
      "SELECT COUNT(*) as count FROM food_listings WHERE donor_id = ?",
      [session.id]
    )?.count || 0;

    stats.activeListings = query.get(
      "SELECT COUNT(*) as count FROM food_listings WHERE donor_id = ? AND status = 'available'",
      [session.id]
    )?.count || 0;

    stats.totalRequests = query.get(
      `SELECT COUNT(*) as count 
       FROM requests r 
       JOIN food_listings fl ON r.listing_id = fl.id 
       WHERE fl.donor_id = ?`,
      [session.id]
    )?.count || 0;

    stats.newRequests = query.get(
      `SELECT COUNT(*) as count 
       FROM requests r 
       JOIN food_listings fl ON r.listing_id = fl.id 
       WHERE fl.donor_id = ? AND r.status = 'new'`,
      [session.id]
    )?.count || 0;

    stats.approvedRequests = query.get(
      `SELECT COUNT(*) as count 
       FROM requests r 
       JOIN food_listings fl ON r.listing_id = fl.id 
       WHERE fl.donor_id = ? AND r.status = 'approved'`,
      [session.id]
    )?.count || 0;

    stats.completedRequests = query.get(
      `SELECT COUNT(*) as count 
       FROM requests r 
       JOIN food_listings fl ON r.listing_id = fl.id 
       WHERE fl.donor_id = ? AND r.status = 'completed'`,
      [session.id]
    )?.count || 0;
  } catch (e) {
    console.error('Failed to query donor dashboard stats:', e);
  }

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', marginBottom: '2rem' }}>
        Welcome back, {session.name}!
      </h2>
      
      {/* Counters Grid */}
      <h3 style={{ marginBottom: '1rem', color: '#107c64' }}>Food Listings Summary</h3>
      <div className="stats-grid">
        <Link href="/donor/my-listings" style={{ textDecoration: 'none' }}>
          <div className="stat-card blue" style={{ backgroundColor: '#107c64' }}>
            <span className="stat-card-title">Total Listed Food</span>
            <span className="stat-card-value">{stats.totalListings}</span>
            <span className="stat-card-icon">🍎</span>
          </div>
        </Link>

        <Link href="/donor/my-listings" style={{ textDecoration: 'none' }}>
          <div className="stat-card green" style={{ backgroundColor: '#14b8a6' }}>
            <span className="stat-card-title">Active Available Listings</span>
            <span className="stat-card-value">{stats.activeListings}</span>
            <span className="stat-card-icon">🔓</span>
          </div>
        </Link>

        <Link href="/donor/list-food" style={{ textDecoration: 'none' }}>
          <div className="stat-card brown" style={{ backgroundColor: '#c68d4d' }}>
            <span className="stat-card-title">Add New Food</span>
            <span className="stat-card-value">+</span>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.5rem', fontWeight: 600 }}>Create new listing</div>
            <span className="stat-card-icon">➕</span>
          </div>
        </Link>
      </div>

      <h3 style={{ margin: '3rem 0 1rem', color: '#107c64' }}>Claims & Requests for My Food</h3>
      <div className="stats-grid">
        <Link href="/donor/my-requests" style={{ textDecoration: 'none' }}>
          <div className="stat-card dark-gray">
            <span className="stat-card-title">All Claims</span>
            <span className="stat-card-value">{stats.totalRequests}</span>
            <span className="stat-card-icon">📁</span>
          </div>
        </Link>

        <Link href="/donor/my-requests?filter=new" style={{ textDecoration: 'none' }}>
          <div className="stat-card gray">
            <span className="stat-card-title">New (Pending Approval)</span>
            <span className="stat-card-value">{stats.newRequests}</span>
            <span className="stat-card-icon">📄</span>
          </div>
        </Link>

        <Link href="/donor/my-requests?filter=approved" style={{ textDecoration: 'none' }}>
          <div className="stat-card blue">
            <span className="stat-card-title">Approved (In Progress)</span>
            <span className="stat-card-value">{stats.approvedRequests}</span>
            <span className="stat-card-icon">🤝</span>
          </div>
        </Link>

        <Link href="/donor/my-requests?filter=completed" style={{ textDecoration: 'none' }}>
          <div className="stat-card green">
            <span className="stat-card-title">Fulfillments Completed</span>
            <span className="stat-card-value">{stats.completedRequests}</span>
            <span className="stat-card-icon">✅</span>
          </div>
        </Link>
      </div>

      <div style={{ marginTop: '3rem', backgroundColor: 'rgba(30, 36, 40, 0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <h3 style={{ marginBottom: '1rem', color: '#14b8a6' }}>Donor Coordination Tips</h3>
        <p style={{ lineHeight: '1.6', opacity: 0.9 }}>
          Keep your listing descriptions clear. When someone submits a request for your food, review their purpose and quantity requirements under the **My Food Requests** menu. You can **Approve** a claim (which provides them your consent) or **Reject** it. Once the recipient collects the food, click **Complete** to log the distribution success and mark your listing as claimed!
        </p>
      </div>
    </div>
  );
}
