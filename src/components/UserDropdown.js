'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserDropdown({ name, avatar, role }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (e) {
      console.error('Failed to logout:', e);
    }
  };

  return (
    <div className="user-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="dashboard-user-dropdown" 
        style={{ 
          cursor: 'pointer', 
          background: 'var(--bg-light)', 
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 1.1rem',
          borderRadius: '50px',
          outline: 'none',
          userSelect: 'none',
          transition: 'all 0.2s ease'
        }}
      >
        <span className="avatar-icon">{avatar}</span>
        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{name}</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none', marginLeft: '0.2rem' }}>▼</span>
      </button>

      {isOpen && (
        <div 
          className="user-dropdown-menu animate-fade-in" 
          style={{ 
            position: 'absolute', 
            top: 'calc(100% + 8px)', 
            right: 0, 
            backgroundColor: '#ffffff', 
            borderRadius: '12px', 
            boxShadow: 'var(--shadow-lg)', 
            border: '1px solid var(--border-light)', 
            minWidth: '180px', 
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', wordBreak: 'break-word' }}>{name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: '2px' }}>{role} Portal</div>
          </div>
          
          <ul style={{ listStyle: 'none', padding: '0.5rem 0', margin: 0 }}>
            {role === 'donor' && (
              <li>
                <Link 
                  href="/donor/profile" 
                  onClick={() => setIsOpen(false)}
                  style={{ 
                    display: 'block', 
                    padding: '0.6rem 1.25rem', 
                    color: 'var(--text-main)', 
                    textDecoration: 'none', 
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  👤 My Profile
                </Link>
              </li>
            )}
            <li>
              <button 
                onClick={handleLogout}
                style={{ 
                  width: '100%',
                  textAlign: 'left',
                  display: 'block', 
                  padding: '0.6rem 1.25rem', 
                  color: '#be123c', 
                  background: 'none',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#fff1f2'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                🚪 Log Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
