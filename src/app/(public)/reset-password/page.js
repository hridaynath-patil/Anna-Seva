'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

function ResetPasswordForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Invalid reset link. Reset token is missing.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Password successfully updated! Redirecting to login...');
        setTimeout(() => {
          router.push('/donor/login');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password. The link may have expired.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="form-card">
        <h1 className="form-title">{t('password_reset.invalid_link_title', 'Invalid Reset Link')}</h1>
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
          {t('password_reset.invalid_link_desc', 'No reset token was found in the link. Please request a new password reset link.')}
        </div>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <Link href="/forgot-password" style={{ color: 'var(--primary-teal)', fontWeight: 'bold', textDecoration: 'none' }}>
            {t('password_reset.request_new_link', 'Request New Link')}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="form-card">
      <h1 className="form-title">{t('password_reset.reset_title', 'Reset Password')}</h1>
      
      <p style={{ 
        textAlign: 'center', 
        color: 'var(--text-muted)', 
        marginBottom: '2rem',
        fontSize: '0.95rem'
      }}>
        {t('password_reset.reset_desc', 'Please enter your new password below.')}
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
        <div className="form-group">
          <label htmlFor="password">{t('password_reset.new_password_label', 'New Password')}</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              style={{ paddingRight: '3rem' }}
              required
              placeholder={t('password_reset.new_password_placeholder', 'Min 6 characters')}
              disabled={loading}
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
                padding: '0.25rem'
              }}
            >
              {showPassword ? t('donor_auth.hide', 'Hide') : t('donor_auth.show', 'Show')}
            </button>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label htmlFor="confirmPassword">{t('password_reset.confirm_password_label', 'Confirm Password')}</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            required
            placeholder={t('password_reset.confirm_password_placeholder', 'Confirm your password')}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="form-submit-btn"
          disabled={loading}
        >
          {loading ? t('password_reset.updating', 'Updating Password...') : t('password_reset.reset_btn', 'Reset Password')}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="public-container animate-fade-in">
      <Suspense fallback={
        <div className="form-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading password reset...</div>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
