'use client';

import { useState } from 'react';

const PRESET_AMOUNTS = [500, 1000, 2100, 5000, 11000, 21000, 51000];

export default function DonatePage() {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    mobile: '',
    pan: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const selectedAmount = customAmount ? Number(customAmount) : Number(amount);

  const handlePresetClick = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setAmount('');
  };

  const handleInfoChange = (e) => {
    setDonorInfo({ ...donorInfo, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!selectedAmount || selectedAmount < 1) {
      setStatus({ type: 'error', message: 'Please select or enter a donation amount.' });
      return;
    }

    if (!donorInfo.name || !donorInfo.email || !donorInfo.mobile) {
      setStatus({ type: 'error', message: 'Please fill in your name, email, and mobile number.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // 1. Create Razorpay order
      const orderRes = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedAmount,
          name: donorInfo.name,
          email: donorInfo.email,
          mobile: donorInfo.mobile,
          pan: donorInfo.pan
        })
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setStatus({ type: 'error', message: orderData.error || 'Failed to create payment order.' });
        setLoading(false);
        return;
      }

      // 2. If dev mode (no Razorpay keys), show success simulation
      if (orderData.dev_mode) {
        setPaymentDetails({
          orderId: orderData.id,
          amount: selectedAmount,
          name: donorInfo.name,
          email: donorInfo.email,
          mobile: donorInfo.mobile,
          pan: donorInfo.pan,
          paymentId: 'pay_dev_' + Date.now(),
          date: new Date().toLocaleString('en-IN')
        });
        setShowReceipt(true);
        setStatus({ type: 'success', message: 'Thank you for your generous donation! (Development Mode)' });
        setLoading(false);
        return;
      }

      // 3. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setStatus({ type: 'error', message: 'Failed to load payment gateway. Please try again.' });
        setLoading(false);
        return;
      }

      // 4. Open Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Shri Vishwanathrao Shamrao Patil Charitable Trust',
        description: 'Anna Seva — Charitable Donation',
        image: '/icon.png',
        order_id: orderData.id,
        prefill: {
          name: donorInfo.name,
          email: donorInfo.email,
          contact: donorInfo.mobile
        },
        notes: {
          donor_pan: donorInfo.pan || 'N/A',
          purpose: 'Anna Seva Charitable Donation'
        },
        theme: {
          color: '#0d9488'
        },
        handler: function (response) {
          // Payment successful
          setPaymentDetails({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: selectedAmount,
            name: donorInfo.name,
            email: donorInfo.email,
            mobile: donorInfo.mobile,
            pan: donorInfo.pan,
            date: new Date().toLocaleString('en-IN')
          });
          setShowReceipt(true);
          setStatus({ type: 'success', message: 'Thank you for your generous donation! A receipt has been generated below.' });
        },
        modal: {
          ondismiss: function () {
            setStatus({ type: '', message: '' });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setStatus({
          type: 'error',
          message: `Payment failed: ${response.error.description}. Please try again.`
        });
      });
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      setStatus({ type: 'error', message: 'An error occurred. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#ffffff' }}>

      {/* Hero Banner */}
      <section className="public-banner" style={{ height: '340px', background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 40%, #fef3c7 100%)' }}>
        <div className="public-banner-content" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <span style={{
              backgroundColor: 'rgba(13, 148, 136, 0.1)',
              color: 'var(--accent-teal-dark)',
              padding: '0.4rem 1.25rem',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '1.5px',
              border: '1.5px solid rgba(13, 148, 136, 0.2)'
            }}>
              TAX EXEMPT UNDER SECTION 80G
            </span>
          </div>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>
            Donate Now & Make a Difference
          </h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
            Your generous contribution helps us feed the hungry and reduce food waste across Maharashtra. Every rupee counts.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="public-container" style={{ margin: '4rem auto', maxWidth: '1100px' }}>

        <div className="donate-page-grid">

          {/* LEFT: Donation Form */}
          <div className="form-card donate-form-card">
            <h2 className="form-title" style={{ textAlign: 'left', fontSize: '1.6rem', marginBottom: '1.75rem' }}>
              💝 Make a Donation
            </h2>

            {status.message && (
              <div style={{
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: status.type === 'success' ? '#166534' : '#991b1b',
                border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                fontWeight: 500,
                fontSize: '0.92rem'
              }}>
                {status.message}
              </div>
            )}

            <form onSubmit={handlePayment}>
              {/* Amount Selection */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--primary-navy-light)' }}>
                  Select Amount (₹)
                </label>
                <div className="donate-amount-grid">
                  {PRESET_AMOUNTS.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handlePresetClick(val)}
                      className={`donate-amount-btn ${amount === val ? 'active' : ''}`}
                    >
                      ₹{val.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Or enter a custom amount
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--primary-navy)'
                    }}>₹</span>
                    <input
                      type="number"
                      id="donate-custom-amount"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="form-input"
                      placeholder="Enter amount"
                      min="1"
                      style={{ paddingLeft: '2.25rem', fontSize: '1.05rem', fontWeight: 600 }}
                    />
                  </div>
                </div>
              </div>

              {/* Donor Info */}
              <div className="responsive-grid-2col" style={{ marginBottom: '0.25rem' }}>
                <div className="form-group">
                  <label htmlFor="donate-name">Full Name *</label>
                  <input
                    type="text"
                    id="donate-name"
                    name="name"
                    value={donorInfo.name}
                    onChange={handleInfoChange}
                    className="form-input"
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="donate-email">Email Address *</label>
                  <input
                    type="email"
                    id="donate-email"
                    name="email"
                    value={donorInfo.email}
                    onChange={handleInfoChange}
                    className="form-input"
                    required
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="responsive-grid-2col" style={{ marginBottom: '0.25rem' }}>
                <div className="form-group">
                  <label htmlFor="donate-mobile">Mobile Number *</label>
                  <input
                    type="tel"
                    id="donate-mobile"
                    name="mobile"
                    value={donorInfo.mobile}
                    onChange={handleInfoChange}
                    className="form-input"
                    required
                    placeholder="10-digit mobile"
                    pattern="[0-9]{10}"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="donate-pan">PAN Number <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>(for 80G receipt)</span></label>
                  <input
                    type="text"
                    id="donate-pan"
                    name="pan"
                    value={donorInfo.pan}
                    onChange={handleInfoChange}
                    className="form-input"
                    placeholder="ABCDE1234F"
                    maxLength="10"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
              </div>

              {/* Selected Amount Summary */}
              {selectedAmount > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, #f0fdfa, #ecfdf5)',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  marginBottom: '1.25rem',
                  border: '1.5px solid rgba(13, 148, 136, 0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.92rem' }}>Donation Amount</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-teal-dark)', fontFamily: 'var(--font-title)' }}>
                    ₹{selectedAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="form-submit-btn"
                disabled={loading}
                style={{
                  fontSize: '1.05rem',
                  padding: '1rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? 'Processing...' : '🙏 Donate with Razorpay'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                Secured by Razorpay · UPI, Cards, Net Banking accepted
              </p>
            </form>
          </div>

          {/* RIGHT: Trust Info & Bank Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Trust Details Card */}
            <div className="donate-info-card">
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: 'rgba(13, 148, 136, 0.1)',
                color: 'var(--accent-teal)',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                fontWeight: 800
              }}>🏛️</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--primary-navy)' }}>Trust Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Name of Trust</span>
                  <div style={{ fontWeight: 700, color: 'var(--primary-navy)', marginTop: '0.15rem' }}>
                    SHRI VISHWANATHRAO SHAMRAO PATIL CHARITABLE TRUST
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Address</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                    Hridaynath Bhagwat Patil, A1 Matoshree Empire, Latur
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>PAN</span>
                    <div style={{ fontWeight: 700, color: 'var(--primary-navy)', marginTop: '0.15rem', fontFamily: 'monospace', letterSpacing: '1px' }}>
                      ABMTS3026R
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>80G URN</span>
                    <div style={{ fontWeight: 700, color: 'var(--primary-navy)', marginTop: '0.15rem', fontFamily: 'monospace', fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                      ABMTS3026RF20251
                    </div>
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Approval Valid</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                    AY 2026-27 to AY 2028-2029
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details Card */}
            <div className="donate-info-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 640px) {
                  .bank-details-card-inner {
                    margin-right: 0 !important;
                  }
                  .qr-container-absolute {
                    position: static !important;
                    margin: 1.25rem auto 0 !important;
                  }
                }
              `}} />

              <div className="bank-details-card-inner" style={{ marginRight: '190px', transition: 'margin 0.3s ease' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(217, 119, 6, 0.1)',
                  color: 'var(--accent-gold)',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  fontWeight: 800
                }}>🏦</div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--primary-navy)' }}>Bank Transfer Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Account Name</span>
                    <div style={{ fontWeight: 700, color: 'var(--primary-navy)', marginTop: '0.15rem', fontSize: '0.85rem' }}>
                      SHRI VISHWANATHRAO SHAMRAO PATIL CH. TRUST
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Account No.</span>
                      <div style={{ fontWeight: 700, color: 'var(--primary-navy)', marginTop: '0.15rem', fontFamily: 'monospace', letterSpacing: '1px' }}>
                        000100780002245
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>IFSC Code</span>
                      <div style={{ fontWeight: 700, color: 'var(--primary-navy)', marginTop: '0.15rem', fontFamily: 'monospace', letterSpacing: '1px' }}>
                        HDFC0YNSBL
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PhonePe QR code in top right (or stacked on mobile) */}
              <div className="qr-container-absolute" style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#f8fafc',
                padding: '0.6rem',
                borderRadius: '12px',
                border: '1px dashed #cbd5e1',
                width: '162px'
              }}>
                <img 
                  src="/phonepe_qr.jpg" 
                  alt="PhonePe QR Code" 
                  style={{
                    width: '146px',
                    height: '146px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    backgroundColor: 'white'
                  }}
                />
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#475569', letterSpacing: '0.3px' }}>Scan with PhonePe</span>
              </div>

              <div style={{
                marginTop: '1.25rem',
                padding: '0.85rem 1rem',
                background: 'rgba(217, 119, 6, 0.06)',
                borderRadius: '10px',
                border: '1px solid rgba(217, 119, 6, 0.15)',
                fontSize: '0.82rem',
                color: '#92400e',
                fontWeight: 500,
                lineHeight: 1.5
              }}>
                ℹ️ For bank transfers, please email the transaction receipt to <strong>vspatil.charitabletrust@gmail.com</strong> to receive your 80G certificate.
              </div>
            </div>

            {/* 80G Tax Benefit Badge */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              borderRadius: '16px',
              padding: '1.75rem',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(13, 148, 136, 0.15)'
              }}></div>
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.85rem', fontWeight: 700 }}>
                🧾 80G Tax Deduction
              </h4>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.65, opacity: 0.85, marginBottom: '0.75rem' }}>
                This donation is eligible for deduction under <strong>Section 80G</strong> of the Income-tax Act, 1961.
              </p>
              <ul style={{ fontSize: '0.82rem', lineHeight: 1.7, opacity: 0.75, paddingLeft: '1.25rem', margin: 0 }}>
                <li>Legal compliance ref: 12-Sub-clause (A) of clause (iv) of first proviso to section 80G(5)</li>
                <li>Approved by the Principal Commissioner of Income Tax</li>
              </ul>
            </div>

            {/* Steps */}
            <div className="donate-info-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--primary-navy)' }}>How It Works</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { icon: '💰', label: 'Select or enter your donation amount' },
                  { icon: '📝', label: 'Fill in your details for the 80G receipt' },
                  { icon: '💳', label: 'Pay securely via Razorpay (UPI/Card/NetBanking)' },
                  { icon: '📄', label: 'Receive your donation receipt & 80G certificate' }
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.88rem' }}>
                    <span style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '1rem'
                    }}>{step.icon}</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Receipt Section */}
        {showReceipt && paymentDetails && (
          <div style={{ marginTop: '3rem' }} id="donation-receipt">
            <div style={{
              background: 'white',
              border: '2px solid var(--accent-teal)',
              borderRadius: '16px',
              padding: '2.5rem',
              maxWidth: '700px',
              margin: '0 auto',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-teal-dark)', marginBottom: '0.5rem' }}>Donation Successful!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Thank you for your generosity, {paymentDetails.name}.</p>
              </div>

              <div style={{
                background: 'var(--bg-light)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                fontSize: '0.88rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Amount</span>
                  <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent-teal-dark)', fontFamily: 'var(--font-title)' }}>
                    ₹{paymentDetails.amount.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Date</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{paymentDetails.date}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Payment ID</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '0.82rem' }}>{paymentDetails.paymentId}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Order ID</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '0.82rem' }}>{paymentDetails.orderId}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Name</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{paymentDetails.name}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Email</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{paymentDetails.email}</div>
                </div>
              </div>

              <div style={{
                textAlign: 'center',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                padding: '1rem',
                borderTop: '1px solid var(--border-light)'
              }}>
                <strong>Shri Vishwanathrao Shamrao Patil Charitable Trust, Latur</strong><br />
                PAN: ABMTS3026R &nbsp;|&nbsp; 80G URN: ABMTS3026RF20251<br />
                A formal 80G receipt will be sent to your email.
              </div>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
