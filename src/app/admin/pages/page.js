'use client';

import { useState, useEffect } from 'react';

export default function AdminPagesEditorPage() {
  const [formData, setFormData] = useState({ about_text: '', contact_text: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      setFormData({
        about_text: data.about_text || '',
        contact_text: data.contact_text || ''
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess('Page contents updated successfully!');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update page contents.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div className="page-header-row">
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem' }}>Edit Page Contents</h2>
      </div>

      {error && (
        <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: 'rgba(245, 61, 86, 0.1)', color: '#ff667a', border: '1px solid rgba(245, 61, 86, 0.2)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: 'rgba(82, 201, 108, 0.1)', color: '#7aff96', border: '1px solid rgba(82, 201, 108, 0.2)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {success}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading editor data...</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'rgba(30, 36, 40, 0.5)', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="aboutText" style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.75rem' }}>About Us Page Content</label>
            <textarea
              id="aboutText"
              rows="8"
              value={formData.about_text}
              onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1.5px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'white',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                lineHeight: '1.6'
              }}
              required
              placeholder="Enter About Us page mission, details..."
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="contactText" style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.75rem' }}>Contact Page Main Description</label>
            <textarea
              id="contactText"
              rows="6"
              value={formData.contact_text}
              onChange={(e) => setFormData({ ...formData, contact_text: e.target.value })}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1.5px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'white',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                lineHeight: '1.6'
              }}
              required
              placeholder="Enter Contact Us page directions or text details..."
            />
          </div>

          <button
            type="submit"
            className="action-btn add"
            style={{ width: '100%', padding: '0.85rem', justifyContent: 'center', fontSize: '1.05rem', fontWeight: '700' }}
            disabled={submitting}
          >
            {submitting ? 'Saving Changes...' : 'Save Page Contents'}
          </button>
        </form>
      )}
    </div>
  );
}
