'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Reset link generated! Please check the server console logs.');
        setEmail('');
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
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
        <h1 className="form-title">{t('password_reset.forgot_title', 'Forgot Password')}</h1>
        
        <p style={{ 
          textAlign: 'center', 
          color: 'var(--text-muted)', 
          marginBottom: '2rem',
          fontSize: '0.95rem'
        }}>
          {t('password_reset.forgot_desc', 'Enter your registered email address. We will generate a secure password reset link for your account.')}
        </p>

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

        {message && (
          <div style={{
            padding: '0.85rem',
            borderRadius: '6px',
            backgroundColor: '#ecfdf5',
            color: '#047857',
            border: '1px solid #a7f3d0',
            marginBottom: '1.5rem',
            fontWeight: 500,
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="email">{t('donor_auth.email_label', 'Email Address')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              placeholder={t('password_reset.email_placeholder', 'e.g. hriday@donor.com')}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="form-submit-btn"
            disabled={loading}
          >
            {loading ? t('password_reset.requesting', 'Requesting Reset...') : t('password_reset.send_link_btn', 'Send Reset Link')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {t('password_reset.remember_password', 'Remember your password?')}{' '}
          <Link href="/donor/login" style={{ color: 'var(--primary-teal)', fontWeight: 'bold', textDecoration: 'none' }}>
            {t('password_reset.back_to_login', 'Back to Login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
