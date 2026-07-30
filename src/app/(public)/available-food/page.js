'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function AvailableFoodPage() {
  const { t } = useLanguage();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  
  // Filter states
  const [filterStateId, setFilterStateId] = useState('');
  const [filterCityId, setFilterCityId] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterStates, setFilterStates] = useState([]);
  const [filterCities, setFilterCities] = useState([]);

  // Form states for Claim Request
  const [requestForm, setRequestForm] = useState({
    requester_name: '',
    requester_mobile: '',
    address: '',
    state_id: '',
    city_id: '',
    reason: '',
    quantity: ''
  });
  const [claimStates, setClaimStates] = useState([]);
  const [claimCities, setClaimCities] = useState([]);
  const [requestStatus, setRequestStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchListings();
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const res = await fetch('/api/states');
      const data = await res.json();
      setFilterStates(data);
      setClaimStates(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchListings = async (stateId = '', cityId = '', search = '') => {
    setLoading(true);
    try {
      let url = '/api/food-listings?status=available&';
      if (stateId) url += `state_id=${stateId}&`;
      if (cityId) url += `city_id=${cityId}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;
      
      const res = await fetch(url);
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterStateChange = async (e) => {
    const stateId = e.target.value;
    setFilterStateId(stateId);
    setFilterCityId('');
    setFilterCities([]);
    fetchListings(stateId, '', filterSearch);

    if (stateId) {
      try {
        const res = await fetch(`/api/cities?state_id=${stateId}`);
        const data = await res.json();
        setFilterCities(data);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleFilterCityChange = (e) => {
    const cityId = e.target.value;
    setFilterCityId(cityId);
    fetchListings(filterStateId, cityId, filterSearch);
  };

  const handleFilterSearchChange = (e) => {
    const search = e.target.value;
    setFilterSearch(search);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings(filterStateId, filterCityId, filterSearch);
  };

  const handleResetFilters = () => {
    setFilterStateId('');
    setFilterCityId('');
    setFilterSearch('');
    setFilterCities([]);
    fetchListings('', '', '');
  };

  const handleClaimStateChange = async (e) => {
    const stateId = e.target.value;
    setRequestForm((prev) => ({ ...prev, state_id: stateId, city_id: '' }));
    setClaimCities([]);

    if (stateId) {
      try {
        const res = await fetch(`/api/cities?state_id=${stateId}`);
        const data = await res.json();
        setClaimCities(data);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openRequestModal = (listing) => {
    setSelectedListing(listing);
    setRequestForm({
      requester_name: '',
      requester_mobile: '',
      address: '',
      state_id: '',
      city_id: '',
      reason: '',
      quantity: ''
    });
    setRequestStatus({ type: '', message: '' });
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setRequestStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: selectedListing.id,
          ...requestForm
        })
      });

      const data = await res.json();

      if (res.ok) {
        setRequestStatus({ type: 'success', message: 'Your claim request has been submitted successfully. The donor will review and approve.' });
        setTimeout(() => {
          setSelectedListing(null);
          fetchListings(filterStateId, filterCityId, filterSearch); // Refresh lists
        }, 3000);
      } else {
        setRequestStatus({ type: 'error', message: data.error || 'Failed to submit request.' });
      }
    } catch (err) {
      setRequestStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="public-container animate-fade-in">
      <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '2rem', marginBottom: '3rem' }}>
        <span style={{ color: 'var(--accent-teal)', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {t('food.network_tag', 'SURPLUS DISTRIBUTION NETWORK')}
        </span>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.75rem)', fontFamily: 'var(--font-title)', fontWeight: 800, marginTop: '0.25rem' }}>
          {t('food.title', 'Available Food Directory')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', maxWidth: '800px' }}>
          {t('food.subtitle', 'Browse the active list of surplus food batches listed by verified donors. NGOs, community kitchens, and coordinators can submit direct claim requests for distribution.')}
        </p>
      </div>

      {/* Directory Search Filters Panel */}
      <form onSubmit={handleSearchSubmit} className="directory-filters-form">
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-navy-light)' }}>
            {t('food.search_keywords', 'Search Keywords')}
          </label>
          <input
            type="text"
            placeholder={t('food.search_placeholder', 'e.g. Rice, Dal, Chapati...')}
            value={filterSearch}
            onChange={handleFilterSearchChange}
            className="form-input"
            style={{ backgroundColor: 'white' }}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-navy-light)' }}>
            {t('food.state', 'State')}
          </label>
          <select
            value={filterStateId}
            onChange={handleFilterStateChange}
            className="form-select"
            style={{ backgroundColor: 'white' }}
          >
            <option value="">{t('food.all_states', 'All States')}</option>
            {filterStates.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-navy-light)' }}>
            {t('food.city', 'City')}
          </label>
          <select
            value={filterCityId}
            onChange={handleFilterCityChange}
            className="form-select"
            style={{ backgroundColor: 'white' }}
            disabled={!filterStateId}
          >
            <option value="">{t('food.all_cities', 'All Cities')}</option>
            {filterCities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="submit"
            className="form-submit-btn"
            style={{ margin: 0, padding: '0.8rem', flex: 2 }}
          >
            {t('food.filter_btn', 'Filter')}
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="action-btn view"
            style={{ height: '46px', flex: 1, justifyContent: 'center', backgroundColor: '#e2e8f0', color: 'var(--primary-navy)', border: 'none' }}
          >
            {t('food.reset_btn', 'Reset')}
          </button>
        </div>
      </form>

      {/* Directory Listings */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          {t('food.loading', 'Loading food catalog...')}
        </div>
      ) : listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-light)', color: 'var(--text-muted)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-navy)' }}>
            {t('food.empty_title', 'No matching food items.')}
          </h3>
          <p>{t('food.empty_desc', 'Try resetting the search filters or check back later.')}</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="public-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '50px', textAlign: 'center' }}>{t('food.col_sno', 'S.NO')}</th>
                  <th>{t('food.col_contact', 'Contact')}</th>
                  <th>{t('food.col_food_desc', 'Food Description')}</th>
                  <th>{t('food.col_address', 'Collection Address')}</th>
                  <th>{t('food.col_location', 'Location')}</th>
                  <th>{t('food.col_status', 'Status')}</th>
                  <th>{t('food.col_date', 'Date Cataloged')}</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>{t('food.col_action', 'Action')}</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing, index) => {
                  const [datePart, timePart] = listing.created_at ? listing.created_at.split(' ') : ['', ''];
                  return (
                    <tr key={listing.id}>
                      <td style={{ fontWeight: 700, textAlign: 'center', color: 'var(--accent-teal)' }}>{index + 1}</td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>{listing.contact_person}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{listing.mobile}</div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>{listing.food_items}</td>
                      <td style={{ fontSize: '0.85rem', lineHeight: '1.4', maxWidth: '220px' }}>{listing.address}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{listing.city_name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{listing.state_name}</div>
                      </td>
                      <td>
                        {listing.status === 'approved' ? (
                          <span className="status-badge approved" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                            {t('food.status_approved', 'Request Approved')}
                          </span>
                        ) : listing.status === 'claimed' ? (
                          <span className="status-badge completed" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                            {t('food.status_completed', 'Request Completed')}
                          </span>
                        ) : (
                          <span className="status-badge available">
                            {t('food.status_available', 'Available')}
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        <div>{datePart}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{timePart}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {listing.status === 'approved' ? (
                          <button
                            className="form-submit-btn"
                            style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem', width: 'auto', margin: 0, backgroundColor: '#cbd5e1', color: '#64748b', cursor: 'not-allowed', boxShadow: 'none' }}
                            disabled
                          >
                            {t('food.btn_claimed', 'Claimed')}
                          </button>
                        ) : listing.status === 'claimed' ? (
                          <button
                            className="form-submit-btn"
                            style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem', width: 'auto', margin: 0, backgroundColor: '#e2e8f0', color: '#94a3b8', cursor: 'not-allowed', boxShadow: 'none' }}
                            disabled
                          >
                            {t('food.btn_completed', 'Completed')}
                          </button>
                        ) : (
                          <button
                            onClick={() => openRequestModal(listing)}
                            className="form-submit-btn"
                            style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem', width: 'auto', margin: 0 }}
                          >
                            {t('food.btn_claim_food', 'Claim Food')}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Grid View */}
          <div className="food-directory-mobile-cards">
            {listings.map((listing, index) => {
              const [datePart, timePart] = listing.created_at ? listing.created_at.split(' ') : ['', ''];
              return (
                <div 
                  key={listing.id} 
                  style={{ 
                    background: 'white', 
                    borderRadius: '12px', 
                    padding: '1.25rem', 
                    border: '1px solid var(--border-light)', 
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: 'var(--accent-teal)', fontSize: '0.85rem' }}>
                      #{index + 1}
                    </span>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                      {datePart} {timePart}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '0.25rem' }}>
                      {listing.food_items}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>
                      <strong>Address:</strong> {listing.address}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px dashed var(--border-light)', paddingTop: '0.75rem', fontSize: '0.85rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>{listing.contact_person}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{listing.mobile}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{listing.city_name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{listing.state_name}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-light)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                    <div>
                      {listing.status === 'approved' ? (
                        <span className="status-badge approved" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)', padding: '0.25rem 0.6rem', fontSize: '0.7rem' }}>
                          {t('food.status_approved', 'Approved')}
                        </span>
                      ) : listing.status === 'claimed' ? (
                        <span className="status-badge completed" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', padding: '0.25rem 0.6rem', fontSize: '0.7rem' }}>
                          {t('food.status_completed', 'Completed')}
                        </span>
                      ) : (
                        <span className="status-badge available" style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem' }}>
                          {t('food.status_available', 'Available')}
                        </span>
                      )}
                    </div>
                    <div>
                      {listing.status === 'approved' ? (
                        <button
                          className="form-submit-btn"
                          style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem', width: 'auto', margin: 0, backgroundColor: '#cbd5e1', color: '#64748b', cursor: 'not-allowed', boxShadow: 'none' }}
                          disabled
                        >
                          {t('food.btn_claimed', 'Claimed')}
                        </button>
                      ) : listing.status === 'claimed' ? (
                        <button
                          className="form-submit-btn"
                          style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem', width: 'auto', margin: 0, backgroundColor: '#e2e8f0', color: '#94a3b8', cursor: 'not-allowed', boxShadow: 'none' }}
                          disabled
                        >
                          {t('food.btn_completed', 'Completed')}
                        </button>
                      ) : (
                        <button
                          onClick={() => openRequestModal(listing)}
                          className="form-submit-btn"
                          style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem', width: 'auto', margin: 0 }}
                        >
                          {t('food.btn_claim_food', 'Claim Food')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Claim Modal */}
      {selectedListing && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <button className="modal-close" onClick={() => setSelectedListing(null)}>×</button>
            
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-navy)', marginBottom: '1.25rem', borderBottom: '2px solid var(--accent-teal-light)', paddingBottom: '0.5rem', fontWeight: 800 }}>
              {t('food.modal_title', 'Food Package Claims')}
            </h2>

            {/* Food Info Summary */}
            <div className="modal-food-summary" style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem', border: '1px solid var(--border-light)' }}>
              <div><strong>{t('food.modal_food_items', 'Food Items:')}</strong> <span style={{ color: 'var(--accent-teal-dark)', fontWeight: 700 }}>{selectedListing.food_items}</span></div>
              <div><strong>{t('food.modal_contact_donor', 'Contact Donor:')}</strong> {selectedListing.contact_person}</div>
              <div><strong>{t('food.modal_phone', 'Phone Number:')}</strong> {selectedListing.mobile}</div>
              <div><strong>{t('food.modal_location', 'Location:')}</strong> {selectedListing.city_name}, {selectedListing.state_name}</div>
              <div style={{ gridColumn: 'span 2' }}><strong>{t('food.modal_address', 'Address:')}</strong> {selectedListing.address}</div>
              {selectedListing.description && (
                <div style={{ gridColumn: 'span 2' }}><strong>{t('food.modal_info', 'Additional Info:')}</strong> {selectedListing.description}</div>
              )}
              <div style={{ gridColumn: 'span 2', fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>{t('food.modal_listed_on', 'Listed On:')}</strong> {selectedListing.created_at}</div>
            </div>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--primary-navy)', fontWeight: 700 }}>
              {t('food.modal_sub_title', 'Submit Allocation Request')}
            </h3>

            {requestStatus.message && (
              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                backgroundColor: requestStatus.type === 'success' ? '#f0fdfa' : '#fef2f2',
                color: requestStatus.type === 'success' ? '#0f766e' : '#991b1b',
                border: `1px solid ${requestStatus.type === 'success' ? '#ccfbf1' : '#fecaca'}`,
                fontWeight: 600,
                fontSize: '0.92rem'
              }}>
                {requestStatus.message}
              </div>
            )}

            <form onSubmit={handleRequestSubmit}>
              <div className="responsive-grid-2col">
                <div className="form-group">
                  <label htmlFor="req_name">{t('food.modal_ngo_label', 'NGO / Recipient Organization Name')}</label>
                  <input
                    type="text"
                    id="req_name"
                    value={requestForm.requester_name}
                    onChange={(e) => setRequestForm({...requestForm, requester_name: e.target.value})}
                    className="form-input"
                    required
                    placeholder={t('food.modal_ngo_placeholder', 'e.g. V.S. Patil Charitable Trust')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="req_mobile">{t('food.modal_mobile_label', 'Recipient Mobile Number')}</label>
                  <input
                    type="tel"
                    id="req_mobile"
                    value={requestForm.requester_mobile}
                    onChange={(e) => setRequestForm({...requestForm, requester_mobile: e.target.value})}
                    className="form-input"
                    required
                    placeholder={t('food.modal_mobile_placeholder', '10-digit mobile')}
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>

              <div className="responsive-grid-2col">
                <div className="form-group">
                  <label htmlFor="req_state">{t('food.state', 'State')}</label>
                  <select
                    id="req_state"
                    value={requestForm.state_id}
                    onChange={handleClaimStateChange}
                    className="form-select"
                    required
                  >
                    <option value="">{t('food.modal_select_state', 'Select State')}</option>
                    {claimStates.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="req_city">{t('food.city', 'City')}</label>
                  <select
                    id="req_city"
                    value={requestForm.city_id}
                    onChange={(e) => setRequestForm({...requestForm, city_id: e.target.value})}
                    className="form-select"
                    required
                    disabled={!requestForm.state_id}
                  >
                    <option value="">{t('food.modal_select_city', 'Select City')}</option>
                    {claimCities.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="req_address">{t('food.modal_delivery_label', 'Delivery/Drop-off Address')}</label>
                <input
                  type="text"
                  id="req_address"
                  value={requestForm.address}
                  onChange={(e) => setRequestForm({...requestForm, address: e.target.value})}
                  className="form-input"
                  required
                  placeholder={t('food.modal_delivery_placeholder', 'Address details for collection')}
                />
              </div>

              <div className="responsive-grid-2-1">
                <div className="form-group">
                  <label htmlFor="req_reason">{t('food.modal_reason_label', 'Claim Justification / Reason')}</label>
                  <input
                    type="text"
                    id="req_reason"
                    value={requestForm.reason}
                    onChange={(e) => setRequestForm({...requestForm, reason: e.target.value})}
                    className="form-input"
                    required
                    placeholder={t('food.modal_reason_placeholder', 'e.g. Free dinner feeding drive in local slum')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="req_qty">{t('food.modal_qty_label', 'Quantity Requested')}</label>
                  <input
                    type="text"
                    id="req_qty"
                    value={requestForm.quantity}
                    onChange={(e) => setRequestForm({...requestForm, quantity: e.target.value})}
                    className="form-input"
                    required
                    placeholder={t('food.modal_qty_placeholder', 'e.g. 20 packs')}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="form-submit-btn"
                disabled={submitting}
                style={{ marginTop: '0.75rem' }}
              >
                {submitting ? t('food.modal_submitting', 'Submitting Allocation Request...') : t('food.modal_confirm_btn', 'Confirm Allocation Claim')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
