'use client';

import Image from 'next/image';
import hridaynathImg from './hridaynath.jpg';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutClient({ dbAboutText }) {
  const { t, language } = useLanguage();

  // If dbAboutText is default English and user selected Hindi/Marathi, use translated mission
  const missionText = (language !== 'en' && (dbAboutText === 'Loading...' || dbAboutText?.startsWith('Anna Seva')))
    ? t('about.default_mission')
    : (dbAboutText || t('about.default_mission'));

  return (
    <div className="public-container animate-fade-in" style={{ maxWidth: '950px' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', borderBottom: '3px solid var(--primary-teal)', paddingBottom: '1rem', marginBottom: '2rem', fontFamily: 'var(--font-title)' }}>
        {t('about.title', 'About Anna Seva')}
      </h1>

      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', lineHeight: '1.8' }}>
        <h2 style={{ color: 'var(--primary-teal-dark)', marginBottom: '1.25rem', fontSize: '1.6rem' }}>
          {t('about.mission_title', 'Our Mission')}
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#334155', whiteSpace: 'pre-line', marginBottom: '2rem' }}>
          {missionText}
        </p>

        <h2 style={{ color: 'var(--primary-teal-dark)', marginBottom: '1.25rem', fontSize: '1.6rem' }}>
          {t('about.values_title', 'Core Value Propositions')}
        </h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li style={{ display: 'flex', gap: '0.85rem' }}>
            <span style={{ color: 'var(--primary-teal)', fontWeight: 'bold' }}>✓</span>
            <div><strong>{t('about.val_1_title', 'Zero Waste:')}</strong> {t('about.val_1_desc', 'Ensuring surplus food goes to stomachs, not landfills.')}</div>
          </li>
          <li style={{ display: 'flex', gap: '0.85rem' }}>
            <span style={{ color: 'var(--primary-teal)', fontWeight: 'bold' }}>✓</span>
            <div><strong>{t('about.val_2_title', 'Safety First:')}</strong> {t('about.val_2_desc', 'Connecting verified donors who maintain food quality standards.')}</div>
          </li>
          <li style={{ display: 'flex', gap: '0.85rem' }}>
            <span style={{ color: 'var(--primary-teal)', fontWeight: 'bold' }}>✓</span>
            <div><strong>{t('about.val_3_title', 'Localized Impact:')}</strong> {t('about.val_3_desc', 'Filtering requests by State and City to optimize delivery ranges.')}</div>
          </li>
          <li style={{ display: 'flex', gap: '0.85rem' }}>
            <span style={{ color: 'var(--primary-teal)', fontWeight: 'bold' }}>✓</span>
            <div><strong>{t('about.val_4_title', 'Direct Approvals:')}</strong> {t('about.val_4_desc', 'Donors maintain full control over who receives their listed food.')}</div>
          </li>
        </ul>
      </div>

      {/* Managing Trustee Section */}
      <div style={{
        marginTop: '2.5rem',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        padding: '2.5rem',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
        display: 'flex',
        flexDirection: 'row',
        gap: '2.5rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{
          position: 'relative',
          width: '160px',
          height: '160px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '4px solid white',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          margin: '0 auto'
        }}>
          <Image
            src={hridaynathImg}
            alt="Shri. Hridaynath Bhagwat Patil"
            placeholder="blur"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        </div>

        <div className="about-trustee-info" style={{ flex: '1', minWidth: '280px' }}>
          <h2 style={{
            color: 'var(--primary-teal-dark)',
            marginBottom: '0.25rem',
            fontSize: '1.8rem',
            fontWeight: '800',
            fontFamily: 'var(--font-title)'
          }}>
            {t('about.trustee_name', 'Shri. Hridaynath Bhagwat Patil')}
          </h2>
          <p style={{
            color: 'var(--primary-teal)',
            fontWeight: '600',
            fontSize: '1rem',
            marginBottom: '1.25rem',
            letterSpacing: '0.05em'
          }}>
            {t('about.trustee_role', 'Founding President')}
          </p>

          <div className="about-trustee-list">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1.3rem', lineHeight: '1', width: '1.3rem', display: 'flex', justifyContent: 'center' }}>🏛️</span>
              <span style={{ color: '#334155', fontSize: '1rem', lineHeight: '1.5' }}>
                {t('about.trustee_org', 'Founding President at Shri. Vishwanathrao Shamrao Patil Trust, Latur')}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: 'var(--primary-teal)', fontSize: '1.5rem', lineHeight: '1', width: '1.3rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>•</span>
              <span style={{ color: '#334155', fontSize: '1rem', lineHeight: '1.5' }}>
                {t('about.trustee_job', 'Software Developer at zCon Solutions Pvt. Ltd, Kothrud')}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: 'var(--primary-teal)', fontSize: '1.5rem', lineHeight: '1', width: '1.3rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>•</span>
              <span style={{ color: '#334155', fontSize: '1rem', lineHeight: '1.5' }}>
                {t('about.trustee_edu', "B.Tech CSE'25 Graduate from Vellore Institute of Technology")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
