'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function PublicHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  const { language, setLanguage, t } = useLanguage();

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

  // Close mobile menu and language dropdown on route change
  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
  }, [pathname]);

  // Close language dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { label: t('nav.home', 'HOME'), path: '/' },
    { label: t('nav.about', 'ABOUT'), path: '/about' },
    { label: t('nav.available_food', 'AVAILABLE FOOD LIST'), path: '/available-food' },
    { label: t('nav.donate', 'DONATE'), path: '/donate' },
    { label: t('nav.contact', 'CONTACT'), path: '/contact' }
  ];

  return (
    <header className={`public-header ${language === 'en' ? 'public-header-en' : ''}`}>
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

        {/* Hamburger Toggle Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`public-menu${menuOpen ? ' mobile-menu-open' : ''}`}>
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
                {t('nav.dashboard', 'DASHBOARD')}
              </Link>
            </li>
          ) : (
            <li>
              <Link
                href="/donor/login"
                className={pathname.startsWith('/donor') ? 'active-link' : ''}
              >
                {t('nav.donor', 'DONOR')}
              </Link>
            </li>
          )}

          {/* Language Selector Feature Button */}
          <li ref={langRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="language-selector-btn"
              style={{
                background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(15, 118, 110, 0.12))',
                border: '1.5px solid var(--accent-teal)',
                color: 'var(--accent-teal-dark)',
                padding: '0.45rem 0.95rem',
                borderRadius: '50px',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                outline: 'none',
                boxShadow: '0 2px 6px rgba(13, 148, 136, 0.12)',
                transition: 'all 0.2s ease'
              }}

            >
              <span style={{ fontSize: '1rem' }}>🌐</span>
              <span>{language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'मराठी'}</span>
              <span style={{ fontSize: '0.7rem', transition: 'transform 0.2s', transform: langOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
            </button>

            {langOpen && (
              <div
                className="language-dropdown-menu animate-fade-in"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
                  border: '1px solid var(--border-light)',
                  minWidth: '170px',
                  zIndex: 1000,
                  overflow: 'hidden',
                  padding: '0.35rem 0'
                }}
              >
                <button
                  type="button"
                  onClick={() => { setLanguage('en'); setLangOpen(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.65rem 1.1rem',
                    border: 'none',
                    background: language === 'en' ? 'rgba(13, 148, 136, 0.1)' : 'transparent',
                    color: language === 'en' ? 'var(--accent-teal-dark)' : 'var(--text-main)',
                    fontWeight: language === 'en' ? '800' : '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    fontSize: '0.9rem',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '1.05rem' }}>🇬🇧</span> English
                </button>
                <button
                  type="button"
                  onClick={() => { setLanguage('hi'); setLangOpen(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.65rem 1.1rem',
                    border: 'none',
                    background: language === 'hi' ? 'rgba(13, 148, 136, 0.1)' : 'transparent',
                    color: language === 'hi' ? 'var(--accent-teal-dark)' : 'var(--text-main)',
                    fontWeight: language === 'hi' ? '800' : '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    fontSize: '0.9rem',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '1.05rem' }}>🇮🇳</span> हिंदी (Hindi)
                </button>
                <button
                  type="button"
                  onClick={() => { setLanguage('mr'); setLangOpen(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.65rem 1.1rem',
                    border: 'none',
                    background: language === 'mr' ? 'rgba(13, 148, 136, 0.1)' : 'transparent',
                    color: language === 'mr' ? 'var(--accent-teal-dark)' : 'var(--text-main)',
                    fontWeight: language === 'mr' ? '800' : '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    fontSize: '0.9rem',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '1.05rem' }}>🚩</span> मराठी (Marathi)
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
