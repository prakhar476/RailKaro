import { useState } from 'react';
import { getBookingByPNR } from '../services/api';
import TicketView from '../components/TicketView';
import toast from 'react-hot-toast';
import '../styles/auth.css';

export default function PNRPage() {
  const [pnr, setPnr] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const clean = pnr.trim();
    if (!clean || clean.length !== 10 || isNaN(clean)) {
      toast.error('Please enter a valid 10-digit PNR number');
      return;
    }
    setLoading(true);
    setSearched(false);
    setBooking(null);
    try {
      const res = await getBookingByPNR(clean);
      setBooking(res.data);
      setSearched(true);
    } catch (err) {
      setSearched(true);
      toast.error(err?.response?.data?.message || 'No booking found for this PNR');
    } finally { setLoading(false); }
  };

  return (
    <div className="pnr-page">
      <div className="container">

        {/* Header */}
        <div className="pnr-search">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-4)' }}>🔍</div>
          <div className="section-eyebrow" style={{ textAlign: 'center' }}>PNR Status</div>
          <h1 className="section-title" style={{ textAlign: 'center' }}>Check Your Booking</h1>
          <p className="section-desc" style={{ textAlign: 'center', margin: '0 auto var(--sp-6)' }}>
            Enter your 10-digit PNR number to get real-time booking and seat status.
          </p>

          <form onSubmit={handleSearch} noValidate>
            <div className="pnr-search__input-row">
              <input
                type="text"
                className="form-input"
                placeholder="Enter 10-digit PNR number"
                value={pnr}
                onChange={(e) => setPnr(e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10}
                style={{ fontSize: '1.0625rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em', textAlign: 'center' }}
              />
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ flexShrink: 0 }}>
                {loading ? <span className="spinner spinner--sm" /> : 'Check PNR'}
              </button>
            </div>
          </form>

          {/* Info chips */}
          <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--sp-5)' }}>
            {['✅ Real-time status', '🎟️ Seat allocation', '📋 Passenger details', '🚂 Train info'].map(t => (
              <span key={t} className="badge badge-amber" style={{ fontSize: '0.8125rem', padding: '5px 12px' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Result */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--sp-10) 0' }}>
            <div className="spinner spinner--lg" />
          </div>
        )}

        {!loading && searched && !booking && (
          <div className="empty-state">
            <div className="empty-state__icon">❌</div>
            <h3 className="empty-state__title">No Booking Found</h3>
            <p className="empty-state__desc">We couldn't find a booking for PNR <span className="mono" style={{ color: 'var(--amber-dark)' }}>{pnr}</span>. Please check the number and try again.</p>
          </div>
        )}

        {!loading && booking && (
          <div className="fade-up">
            <TicketView booking={booking} />
            <div style={{ textAlign: 'center', marginTop: 'var(--sp-5)' }}>
              <button
                className="btn btn-outline"
                onClick={() => { setBooking(null); setSearched(false); setPnr(''); }}
              >
                ← Search Another PNR
              </button>
            </div>
          </div>
        )}

        {/* How it works */}
        {!searched && !loading && (
          <div style={{ maxWidth: 720, margin: '0 auto', marginTop: 'var(--sp-10)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-5)' }}>
              {[
                { icon: '📩', title: 'Find Your PNR', desc: 'Your PNR is in your booking confirmation email or SMS.' },
                { icon: '🔢', title: 'Enter the Number', desc: 'Type your 10-digit PNR in the search box above.' },
                { icon: '📋', title: 'View Status', desc: 'See passenger names, seat numbers, and booking status instantly.' },
              ].map((c) => (
                <div key={c.title} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)', padding: 'var(--sp-6)', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--sp-3)' }}>{c.icon}</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 'var(--sp-2)' }}>{c.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
