import PublicHeader from '@/components/PublicHeader';
import Image from 'next/image';
import trustLogoImg from './about/trust_logo.jpg';

export default function PublicLayout({ children }) {
  return (
    <>
      <PublicHeader />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      <footer className="public-footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2.5rem 1rem' }}>
        <Image 
          src={trustLogoImg} 
          alt="Shri Vishwanathrao Shamrao Patil Charitable Trust Logo" 
          width={64}
          height={64}
          style={{ 
            objectFit: 'contain', 
            backgroundColor: '#ffffff', 
            borderRadius: '6px', 
            padding: '3px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        />
        <p>© {new Date().getFullYear()} Anna Seva. All rights reserved. Connecting Donors & Feeding the Needy.</p>
      </footer>
    </>
  );
}
