'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function DonorRegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    state_id: '',
    city_id: ''
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetch('/api/states')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStates(data);
        } else {
          console.error('Failed to fetch states:', data);
          setStates([]);
        }
      })
      .catch(() => {});
  }, []);

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setFormData((prev) => ({ ...prev, state_id: stateId, city_id: '' }));
    setCities([]);

    if (stateId) {
      try {
        const res = await fetch(`/api/cities?state_id=${stateId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setCities(data);
        } else {
          console.error('Failed to fetch cities:', data);
          setCities([]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          password: '',
          mobile: '',
          address: '',
          state_id: '',
          city_id: ''
        });
      } else {
        setError(data.error || 'Failed to register.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="public-container animate-fade-in">
        <div className="form-card" style={{ maxWidth: '600px', textAlign: 'center', padding: '2.5rem 2rem' }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            backgroundColor: 'rgba(20, 184, 166, 0.1)',
            color: 'var(--primary-teal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2rem'
          }}>
            ✓
          </div>
          <h1 className="form-title" style={{ marginBottom: '1rem' }}>
            {t('donor_auth.reg_submitted_title', 'Registration Submitted!')}
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-light)',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            {t('donor_auth.reg_submitted_desc', 'Thank you for registering as a food donor with Anna Seva (अन्न सेवा). Your registration has been submitted for administrator approval. Once approved, you will receive confirmation and will be able to log in to post food listings.')}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/" className="form-submit-btn" style={{
              textDecoration: 'none',
              display: 'inline-block',
              width: 'auto',
              padding: '0.75rem 2rem',
              backgroundColor: 'transparent',
              border: '1.5px solid var(--primary-teal)',
              color: 'var(--primary-teal)',
              fontWeight: 600,
              borderRadius: '6px',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}>
              {t('donor_auth.go_home', 'Go to Home')}
            </Link>
            <Link href="/donor/login" className="form-submit-btn" style={{
              textDecoration: 'none',
              display: 'inline-block',
              width: 'auto',
              padding: '0.75rem 2rem',
              fontWeight: 600,
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              {t('donor_auth.go_login', 'Login Page')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-container animate-fade-in">
      <div className="form-card" style={{ maxWidth: '650px' }}>
        <h1 className="form-title">{t('donor_auth.register_title', 'Donor Registration')}</h1>

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
          <div className="responsive-grid-2col">
            <div className="form-group">
              <label htmlFor="name">{t('donor_auth.name_label', 'Full Name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
                placeholder={t('donor_auth.name_placeholder', 'Enter name')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t('donor_auth.email_label', 'Email Address')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
                placeholder={t('donor_auth.email_placeholder', 'e.g. patil@donor.com')}
              />
            </div>
          </div>

          <div className="responsive-grid-2col">
            <div className="form-group">
              <label htmlFor="password">{t('donor_auth.password_label', 'Password')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
            <div className="form-group">
              <label htmlFor="mobile">{t('donor_auth.mobile_label', 'Mobile Number')}</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="form-input"
                required
                placeholder={t('donor_auth.mobile_placeholder', '10-digit mobile')}
                pattern="[0-9]{10}"
              />
            </div>
          </div>

          <div className="responsive-grid-2col">
            <div className="form-group">
              <label htmlFor="state_id">{t('donor_auth.state_label', 'State')}</label>
              <select
                id="state_id"
                name="state_id"
                value={formData.state_id}
                onChange={handleStateChange}
                className="form-select"
                required
              >
                <option value="">{t('donor_auth.select_state', 'Select State')}</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="city_id">{t('donor_auth.city_label', 'City')}</label>
              <select
                id="city_id"
                name="city_id"
                value={formData.city_id}
                onChange={handleChange}
                className="form-select"
                required
                disabled={!formData.state_id}
              >
                <option value="">{t('donor_auth.select_city', 'Select City')}</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label htmlFor="address">{t('donor_auth.address_label', 'Address')}</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
              required
              placeholder={t('donor_auth.address_placeholder', 'e.g. b755 kolhapur')}
            />
          </div>

          <button
            type="submit"
            className="form-submit-btn"
            disabled={loading}
          >
            {loading ? t('donor_auth.submitting', 'Submitting...') : t('donor_auth.register_btn', 'Sent for Approval for Registration')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {t('donor_auth.already_account', 'Already have an account?')}{' '}
          <Link href="/donor/login" style={{ color: 'var(--primary-teal)', fontWeight: 'bold', textDecoration: 'none' }}>
            {t('donor_auth.login_btn', 'Login here')}
          </Link>
        </p>
      </div>
    </div>
  );
}
