'use client';

import Link from 'next/link';
import NewsCarousel from '@/components/NewsCarousel';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePageClient({ donorCount, foodCount, completedCount }) {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#ffffff' }}>

      {/* Immersive Hero Section */}
      <section className="public-banner" style={{ height: '480px' }}>
        <div className="public-banner-content" style={{ maxWidth: '950px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <span className="hero-trust-badge" style={{
              backgroundColor: 'rgba(13, 148, 136, 0.08)',
              color: 'var(--accent-teal-dark)',
              borderRadius: '50px',
              border: '1.5px solid rgba(13, 148, 136, 0.2)',
              fontWeight: '800',
              lineHeight: '1.4'
            }}>
              {t('home.trust_badge_mr', 'श्री. विश्वनाथराव शामराव पाटील चॅरिटेबल ट्रस्ट उपक्रम')}
            </span>
            <span className="hero-trust-badge-en" style={{
              backgroundColor: 'rgba(13, 148, 136, 0.08)',
              color: 'var(--accent-teal-dark)',
              borderRadius: '50px',
              border: '1.5px solid rgba(13, 148, 136, 0.15)',
              fontWeight: '700',
              letterSpacing: '2px',
              lineHeight: '1.4'
            }}>
              {t('home.trust_badge_en', 'SHRI VISHWANATHRAO SHAMRAO PATIL CHARITABLE TRUST INITIATIVE')}
            </span>
          </div>
          <h1>
            {t('home.hero_title_1', 'Empowering Communities.')} <br />
            {t('home.hero_title_2', 'Reducing Food Waste.')}
          </h1>
          <p>
            {t('home.hero_desc', 'We bridge the gap between food abundance and hunger. Through local action and trusted coordination, we redirect surplus meals to families and shelters who need them most.')}
          </p>
          <div className="hero-cta-row" style={{ marginTop: '2rem' }}>
            <Link href="/available-food" className="form-submit-btn" style={{ width: 'auto', padding: '0.75rem 1.85rem', borderRadius: '50px', textDecoration: 'none', display: 'inline-block', margin: 0, fontSize: '0.92rem' }}>
              {t('home.req_food_btn', 'Request Food Assistance')}
            </Link>
            <Link href="/donor/register" style={{ padding: '0.75rem 1.85rem', borderRadius: '50px', backgroundColor: 'transparent', border: '2px solid var(--primary-navy)', color: 'var(--primary-navy)', fontWeight: '700', fontSize: '0.92rem', textDecoration: 'none', transition: 'all 0.25s ease' }}>
              {t('home.become_donor_btn', 'Become a Verified Donor')}
            </Link>
          </div>
        </div>
      </section>

      {/* News Coverage Carousel */}
      <NewsCarousel />

      {/* Core Mission Callout */}
      <section style={{ padding: '5rem 2rem', borderBottom: '1px solid var(--border-light)', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', marginBottom: '2.5rem', fontFamily: 'var(--font-title)', fontWeight: 800, textAlign: 'center' }}>
            {t('home.commitment_title', 'Our Commitment to Social Welfare')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--accent-teal)', fontSize: '1.5rem', lineHeight: '1.2', flexShrink: 0 }}>✓</span>
              <div>
                <strong style={{ color: 'var(--primary-navy)', fontSize: '1.15rem', display: 'block', marginBottom: '0.25rem' }}>
                  {t('home.commitment_1_title', 'Coordinated Food Rescue Network')}
                </strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  {t('home.commitment_1_desc', 'Operated under the patronage of the Shri Vishwanathrao Shamrao Patil Charitable Trust.')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--accent-teal)', fontSize: '1.5rem', lineHeight: '1.2', flexShrink: 0 }}>✓</span>
              <div>
                <strong style={{ color: 'var(--primary-navy)', fontSize: '1.15rem', display: 'block', marginBottom: '0.25rem' }}>
                  {t('home.commitment_2_title', 'Collaborative Local Alliances')}
                </strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  {t('home.commitment_2_desc', 'Partnering directly with Restaurants and local volunteers to map and verify surplus food availability.')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--accent-teal)', fontSize: '1.5rem', lineHeight: '1.2', flexShrink: 0 }}>✓</span>
              <div>
                <strong style={{ color: 'var(--primary-navy)', fontSize: '1.15rem', display: 'block', marginBottom: '0.25rem' }}>
                  {t('home.commitment_3_title', 'Wide-Reaching Food Distribution')}
                </strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  {t('home.commitment_3_desc', 'Delivering fresh, quality-checked meals to families, orphanages, homes across Maharashtra.')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--accent-teal)', fontSize: '1.5rem', lineHeight: '1.2', flexShrink: 0 }}>✓</span>
              <div>
                <strong style={{ color: 'var(--primary-navy)', fontSize: '1.15rem', display: 'block', marginBottom: '0.25rem' }}>
                  {t('home.commitment_4_title', 'Direct & Transparent Impact')}
                </strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  {t('home.commitment_4_desc', 'Enabling real-time request tracking and direct coordination between verified donors and organizations for total accountability.')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Dashboard Section */}
      <section className="public-container" style={{ margin: '5rem auto 3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: 'var(--accent-teal)', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            {t('home.impact_tag', 'TRACKING REAL CHANGE')}
          </span>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontFamily: 'var(--font-title)', fontWeight: 800 }}>
            {t('home.impact_title', 'Our Impact Dashboard')}
          </h2>
        </div>

        <div className="stats-grid">
          <div className="stat-card blue" style={{ minHeight: '180px', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'white', color: 'var(--text-main)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
            <span className="stat-card-title" style={{ color: 'var(--text-muted)' }}>
              {t('home.active_donors', 'Active Donors')}
            </span>
            <span className="stat-card-value" style={{ color: 'var(--primary-navy)' }}>{donorCount}</span>
            <div style={{ fontSize: '0.9rem', marginTop: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {t('home.active_donors_desc', 'Sponsors backing our distribution')}
            </div>
            <span className="stat-card-icon" style={{ color: 'var(--primary-navy)', opacity: 0.05 }}>👥</span>
          </div>

          <div className="stat-card brown" style={{ minHeight: '180px', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'white', color: 'var(--text-main)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
            <span className="stat-card-title" style={{ color: 'var(--text-muted)' }}>
              {t('home.food_listed', 'Food Batches Listed')}
            </span>
            <span className="stat-card-value" style={{ color: 'var(--primary-navy)' }}>{foodCount}</span>
            <div style={{ fontSize: '0.9rem', marginTop: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {t('home.food_listed_desc', 'Total surplus allocations cataloged')}
            </div>
            <span className="stat-card-icon" style={{ color: 'var(--primary-navy)', opacity: 0.05 }}>🍎</span>
          </div>

          <div className="stat-card green" style={{ minHeight: '180px', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'white', color: 'var(--text-main)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
            <span className="stat-card-title" style={{ color: 'var(--text-muted)' }}>
              {t('home.fulfillments', 'Fulfillments Handled')}
            </span>
            <span className="stat-card-value" style={{ color: 'var(--primary-navy)' }}>{completedCount}</span>
            <div style={{ fontSize: '0.9rem', marginTop: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {t('home.fulfillments_desc', 'Direct deliveries successfully completed')}
            </div>
            <span className="stat-card-icon" style={{ color: 'var(--primary-navy)', opacity: 0.05 }}>✅</span>
          </div>
        </div>
      </section>

      {/* Modern Three Pillar Section */}
      <section style={{ backgroundColor: '#f8fafc', padding: '6rem 0', borderTop: '1px solid var(--border-light)' }}>
        <div className="public-container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--accent-teal)', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {t('home.pillars_tag', 'HOW WE COORDINATE')}
            </span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontFamily: 'var(--font-title)', fontWeight: 800 }}>
              {t('home.pillars_title', 'Operating Pillars')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

            {/* Donor */}
            <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '14px', backgroundColor: 'rgba(13, 148, 136, 0.1)', color: 'var(--accent-teal)', fontSize: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', fontWeight: 800 }}>
                01
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                {t('home.pillar_1_title', 'List Surplus Food')}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: '1.7', flex: 1 }}>
                {t('home.pillar_1_desc', 'Registered donors specify the type of food, quantity (number of plates), collection location, and contact mobile. The listing instantly displays on the public directory.')}
              </p>
              <Link href="/donor/login" style={{ color: 'var(--accent-teal)', fontWeight: 700, textDecoration: 'none', marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                {t('home.pillar_1_link', 'Donor Login →')}
              </Link>
            </div>

            {/* Requester */}
            <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '14px', backgroundColor: 'rgba(217, 119, 6, 0.1)', color: 'var(--accent-gold)', fontSize: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', fontWeight: 800 }}>
                02
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                {t('home.pillar_2_title', 'Request & Collect')}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: '1.7', flex: 1 }}>
                {t('home.pillar_2_desc', 'NGOs, shelter homes, and volunteers filter listed food by state and city. They submit claims specifying the quantity, purpose, and delivery address.')}
              </p>
              <Link href="/available-food" style={{ color: 'var(--accent-gold)', fontWeight: 700, textDecoration: 'none', marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                {t('home.pillar_2_link', 'Browse Food List →')}
              </Link>
            </div>

            {/* Admin */}
            <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '14px', backgroundColor: 'rgba(15, 23, 42, 0.1)', color: 'var(--primary-navy)', fontSize: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', fontWeight: 800 }}>
                03
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                {t('home.pillar_3_title', 'Audit & Monitor')}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: '1.7', flex: 1 }}>
                {t('home.pillar_3_desc', 'System administrators manage regional coverage (states/cities), monitor donor enrollments, approve claims where needed, and compile performance audit reports.')}
              </p>
              <Link href="/donor/login" style={{ color: 'var(--primary-navy)', fontWeight: 700, textDecoration: 'none', marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                {t('home.pillar_3_link', 'Donor Login →')}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Charitable Trust CTA block */}
      <section style={{ backgroundColor: 'var(--accent-teal-light)', color: 'var(--primary-navy)', padding: '6rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-navy)', marginBottom: '1.5rem', fontFamily: 'var(--font-title)', fontWeight: 800 }}>
            {t('home.trust_cta_title', 'Help Us Prevent Hunger')}
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2.5rem' }}>
            {t('home.trust_cta_desc', 'Whether you represent a banquet hall with surplus catering or an NGO looking for support, Anna Seva provides a modern, direct, and verified platform to coordinate logistics and distribute fresh meals.')}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/donate" className="form-submit-btn" style={{ width: 'auto', padding: '1rem 2.5rem', borderRadius: '50px', textDecoration: 'none', margin: 0, background: 'linear-gradient(135deg, #d97706, #b45309)', boxShadow: '0 4px 16px rgba(217, 119, 6, 0.3)' }}>
              {t('home.donate_now', '💝 Donate Now')}
            </Link>
            <Link href="/donor/register" className="form-submit-btn" style={{ width: 'auto', padding: '1rem 2.5rem', borderRadius: '50px', textDecoration: 'none', margin: 0 }}>
              {t('home.reg_as_donor', 'Register as Donor')}
            </Link>
            <Link href="/contact" style={{ padding: '1rem 2.5rem', borderRadius: '50px', backgroundColor: 'transparent', border: '2px solid var(--primary-navy)', color: 'var(--primary-navy)', fontWeight: '700', fontSize: '1rem', textDecoration: 'none', transition: 'all 0.25s ease' }}>
              {t('home.contact_office', 'Contact Trust Office')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
