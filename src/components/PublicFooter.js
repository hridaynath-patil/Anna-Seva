'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function PublicFooter() {
  const { t } = useLanguage();

  return (
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'center' }}>
          <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '700', margin: 0, letterSpacing: '0.5px' }}>
            {t('footer.trust_title', 'Shri Vishwanathrao Shamrao Patil Charitable Trust, Latur')}
          </h4>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '0.92rem', lineHeight: '1.5' }}>
            {t('footer.rights', '© 2026 Anna Seva. All rights reserved. Connecting Donors & Feeding the Needy.')}
          </p>
        </div>
      </div>
    </footer>
  );
}
