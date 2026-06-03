'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import trustLogoImg from '../../about/trust_logo.jpg';

export default function AdminLoginPage() {
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
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
          router.refresh();
        } else {
          setError('Access Denied: You are not authorized as Admin.');
          // Log them out to clear session
          fetch('/api/auth/logout', { method: 'POST' });
        }
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
    <div className="public-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
        <Image 
          src={trustLogoImg} 
          alt="Shri Vishwanathrao Shamrao Patil Charitable Trust Logo" 
          width={130}
          height={130}
          style={{ 
            objectFit: 'contain', 
            backgroundColor: '#ffffff', 
            borderRadius: '12px', 
            padding: '6px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '1px solid var(--border-color)'
          }}
        />
      </div>
      <div className="form-card" style={{ marginTop: '0', borderTop: '4px solid var(--admin-sidebar-bg)' }}>
        <h1 className="form-title" style={{ color: 'var(--admin-sidebar-bg)' }}>Admin Portal</h1>
        
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
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              required
              placeholder="e.g. admin@annaseva.org"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
                style={{ paddingRight: '3rem' }}
                required
                placeholder="Enter password"
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
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="form-submit-btn"
            style={{ backgroundColor: 'var(--admin-sidebar-bg)' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
