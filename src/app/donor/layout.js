import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DonorLayoutClient from './DonorLayoutClient';

export const revalidate = 0; // Disable layout caching

export default async function DonorLayout({ children }) {
  const session = await getSession();

  if (!session || session.role !== 'donor') {
    redirect('/donor/login');
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img 
            src="/icon.png" 
            alt="Anna Seva Logo" 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid var(--accent-teal)'
            }} 
          />
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent-teal)', lineHeight: '1.1' }}>अन्न सेवा</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginTop: '2px' }}>DONOR</span>
          </span>
        </div>
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <Link href="/donor/dashboard" className="sidebar-link">
              📊 Dashboard
            </Link>
          </li>
          <li className="sidebar-item">
            <Link href="/donor/list-food" className="sidebar-link">
              ➕ List Food
            </Link>
          </li>
          <li className="sidebar-item">
            <Link href="/donor/my-listings" className="sidebar-link">
              🍎 My Listed Foods
            </Link>
          </li>
          <li className="sidebar-item">
            <Link href="/donor/my-requests" className="sidebar-link">
              ✉ My Food Requests
            </Link>
          </li>
          <li className="sidebar-item">
            <Link href="/donor/profile" className="sidebar-link">
              👤 My Profile
            </Link>
          </li>
          <li className="sidebar-item" style={{ marginTop: '2rem' }}>
            <Link href="/" className="sidebar-link" style={{ opacity: 0.8 }}>
              🏠 Back to Public Site
            </Link>
          </li>
        </ul>
        <div className="sidebar-footer">
          <div className="sidebar-user">Donor: {session.name}</div>
          <DonorLayoutClient />
        </div>
      </aside>

      {/* Main Panel */}
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-title-area">
            <h3 style={{ fontFamily: 'var(--font-title)', fontWeight: 600 }}>DONOR PORTAL - ANNA SEVA</h3>
          </div>
          <div className="dashboard-user-dropdown">
            <span className="avatar-icon">D</span>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{session.name}</span>
          </div>
        </header>

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
