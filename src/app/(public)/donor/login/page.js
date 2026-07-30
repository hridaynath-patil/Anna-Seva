'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function DonorLoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        // Successful login
        router.push('/donor/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-container animate-fade-in">
      <div className="form-card">
        <h1 className="form-title">{t('donor_auth.login_title', 'Donor Login')}</h1>
        
        {error && (
          <div style={{
            padding: '0.85rem',
            borderRadius: '6px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            marginBottom: '1.5rem',
            fontWeight: 500,
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t('donor_auth.email_label', 'Email Address')}</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              required
              placeholder={t('donor_auth.email_placeholder', 'e.g. patil@donor.com')}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label htmlFor="password">{t('donor_auth.password_label', 'Password')}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
                style={{ paddingRight: '3rem' }}
                required
                placeholder={t('donor_auth.password_placeholder', 'Enter password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  userSelect: 'none',
                  outline: 'none',
                  padding: '0.25rem'
                }}
              >
                {showPassword ? t('donor_auth.hide', 'Hide') : t('donor_auth.show', 'Show')}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.75rem' }}>
            <Link 
              href="/forgot-password" 
              style={{ 
                color: 'var(--accent-teal)', 
                fontSize: '0.85rem', 
                fontWeight: 600, 
                textDecoration: 'none' 
              }}
            >
              {t('donor_auth.forgot_password', 'Forgot Password?')}
            </Link>
          </div>

          <button
            type="submit"
            className="form-submit-btn"
            disabled={loading}
          >
            {loading ? t('donor_auth.logging_in', 'Logging in...') : t('donor_auth.login_btn', 'Login')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {t('donor_auth.no_account', "Don't have an account?")}{' '}
          <Link href="/donor/register" style={{ color: 'var(--primary-teal)', fontWeight: 'bold', textDecoration: 'none' }}>
            {t('donor_auth.register_here', 'Register here')}
          </Link>
        </p>

        {/* Admin Portal Button */}
        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
          <Link
            href="/admin/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--primary-navy)',
              color: '#ffffff',
              padding: '0.65rem 1.4rem',
              borderRadius: '50px',
              fontSize: '0.88rem',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🔐</span> {t('donor_auth.admin_portal_btn', 'Admin Portal Login')}
          </Link>
        </div>
      </div>
    </div>
  );
}
