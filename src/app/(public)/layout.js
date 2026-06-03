import PublicHeader from '@/components/PublicHeader';

export default function PublicLayout({ children }) {
  return (
    <>
      <PublicHeader />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      <footer className="public-footer">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', maxWidth: '800px', margin: '0 auto' }}>
          <img 
            src="/trust_logo.jpg" 
            alt="Shri Vishwanathrao Shamrao Patil Charitable Trust Logo" 
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '8px', 
              objectFit: 'contain',
              backgroundColor: '#ffffff',
              padding: '4px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '700', margin: 0, letterSpacing: '0.5px' }}>
              Shri Vishwanathrao Shamrao Patil Charitable Trust, Latur
            </h4>
            <p style={{ margin: 0, opacity: 0.85, fontSize: '0.92rem', lineHeight: '1.5' }}>
              © 2026 Anna Seva. All rights reserved. Connecting Donors & Feeding the Needy.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
