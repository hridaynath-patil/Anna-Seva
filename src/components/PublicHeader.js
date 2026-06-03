'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PublicHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT', path: '/about' },
    { label: 'AVAILABLE FOOD LIST', path: '/available-food' },
    { label: 'CONTACT', path: '/contact' }
  ];

  return (
    <header className="public-header">
      <nav className="public-nav">
        <Link href="/" className="public-logo">
          <img 
            src="/icon.png" 
            alt="Anna Seva Logo" 
            style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--accent-teal)'
            }} 
          />
          <span className="public-logo-devanagari">अन्न सेवा</span>
          <span>ANNA SEVA</span>
        </Link>
        <ul className="public-menu">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={isActive ? 'active-link' : ''}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          
          {user ? (
            <li>
              <Link
                href={user.role === 'admin' ? '/admin/dashboard' : '/donor/dashboard'}
                className="dashboard-badge-link"
                style={{
                  backgroundColor: '#12181b',
                  color: 'white',
                  padding: '0.4rem 1rem',
                  borderRadius: '50px',
                  fontSize: '0.9rem',
                  fontWeight: '700'
                }}
              >
                DASHBOARD
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link
                  href="/donor/login"
                  className={pathname.startsWith('/donor') ? 'active-link' : ''}
                >
                  DONOR
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className={pathname.startsWith('/admin') ? 'active-link' : ''}
                >
                  ADMIN
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
