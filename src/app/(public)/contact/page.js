'use client';

import { useState, useEffect } from 'react';

export default function ContactPage() {
  const [pageText, setPageText] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/pages')
      .then((res) => res.json())
      .then((data) => {
        if (data.contact_text) {
          setPageText(data.contact_text);
        }
      })
      .catch(() => { });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: 'Your message has been sent successfully. We will get back to you soon!' });
        setFormData({ name: '', email: '', mobile: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send message.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'An error occurred. Please try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="public-container animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>

      {/* Contact Info Panel */}
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-dark)', marginBottom: '1rem', fontFamily: 'var(--font-title)' }}>
          Contact Us
        </h1>
        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.7', whiteSpace: 'pre-line', marginBottom: '2rem' }}>
          {pageText || 'Feel free to contact us with any questions, partnership proposals, or logistics issues. Fill out the form or write to us directly.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', backgroundColor: 'var(--primary-teal-light)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary-teal-dark)' }}>✉</span>
            <div>
              <div style={{ fontWeight: 600 }}>Email Address</div>
              <div style={{ color: 'var(--text-muted)' }}>vspatil.charitabletrust@gmail.com</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', backgroundColor: 'var(--primary-teal-light)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary-teal-dark)' }}>📞</span>
            <div>
              <div style={{ fontWeight: 600 }}>Helpline Number</div>
              <div style={{ color: 'var(--text-muted)' }}>+91 1800-111-222</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', backgroundColor: 'var(--primary-teal-light)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary-teal-dark)' }}>📍</span>
            <div>
              <div style={{ fontWeight: 600 }}>Central Office</div>
              <div style={{ color: 'var(--text-muted)' }}>Matoshree Empire, Latur, Maharashtra, India</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Form */}
      <div className="form-card" style={{ width: '100%', margin: '0' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Send Message</h2>

        {status.message && (
          <div style={{
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: status.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            fontWeight: 500
          }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter 10-digit mobile"
              pattern="[0-9]{10}"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-textarea"
              required
              rows="4"
              placeholder="Write your enquiry message here..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="form-submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Sending...' : 'Submit Enquiry'}
          </button>
        </form>
      </div>

    </div>
  );
}
