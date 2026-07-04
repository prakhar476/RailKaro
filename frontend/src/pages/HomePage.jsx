import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StationInput from '../components/StationInput';
import { getStations } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/home.css';

const POPULAR_ROUTES = [
  { from: 'New Delhi', to: 'Mumbai Central', fromCode: 'NDLS', toCode: 'BCT', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80', trains: '18 trains', tag: 'Popular' },
  { from: 'New Delhi', to: 'Bengaluru', fromCode: 'NDLS', toCode: 'SBC', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80', trains: '14 trains', tag: 'Fast Route' },
  { from: 'New Delhi', to: 'Chennai', fromCode: 'NDLS', toCode: 'MAS', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80', trains: '22 trains', tag: 'Best Value' },
  { from: 'Mumbai', to: 'Ahmedabad', fromCode: 'BCT', toCode: 'ADI', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', trains: '8 trains', tag: '' },
  { from: 'New Delhi', to: 'Jaipur', fromCode: 'NDLS', toCode: 'JP', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80', trains: '12 trains', tag: 'Day Trip' },
  { from: 'Delhi', to: 'Agra', fromCode: 'NDLS', toCode: 'AGC', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80', trains: '6 trains', tag: 'Heritage' },
];

const FEATURES = [
  { icon: '⚡', title: 'Instant Confirmation', desc: 'Get your PNR and e-ticket within seconds of booking. No waiting, no queues.' },
  { icon: '🔒', title: 'Secure Payments', desc: 'Bank-grade encryption for all transactions. Your card details are never stored.' },
  { icon: '📱', title: 'Real-time PNR Status', desc: 'Track your booking live. Get seat allocation and coach position updates.' },
  { icon: '↩️', title: 'Easy Cancellations', desc: 'Cancel anytime and get instant refunds as per railway cancellation policy.' },
  { icon: '🎟️', title: 'All Classes Available', desc: 'Book Sleeper, AC 3 Tier, AC 2 Tier, First Class, and Chair Car in one place.' },
  { icon: '🌐', title: '300+ Stations', desc: 'Search trains between 300+ Indian railway stations with live availability.' },
];

export default function HomePage() {
  const [stations, setStations] = useState([]);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  useEffect(() => {
    getStations().then(d => setStations(d.data)).catch(() => {});
  }, []);

  const handleSwap = () => { const tmp = from; setFrom(to); setTo(tmp); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from) { toast.error('Please select a departure station'); return; }
    if (!to)   { toast.error('Please select a destination station'); return; }
    if (from.code === to.code) { toast.error('Departure and destination cannot be the same'); return; }
    navigate(`/search?from=${from.code}&to=${to.code}&date=${date}&fromName=${encodeURIComponent(from.name)}&toName=${encodeURIComponent(to.name)}`);
  };

  const handleRouteClick = (r) => {
    navigate(`/search?from=${r.fromCode}&to=${r.toCode}&date=${date}`);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <img
          className="hero__bg"
          src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1600&q=80"
          alt="Indian train moving through scenic landscape"
          loading="eager"
        />
        <div className="hero__overlay" />
        <div className="container hero__content">
          <div className="hero__eyebrow">🇮🇳 India's Premier Rail Booking Portal</div>
          <h1 className="hero__headline">
            Your Journey Starts with a Single <em>Search</em>
          </h1>
          <p className="hero__sub">
            Book train tickets across 8000+ routes instantly. Real-time seat availability, secure payments, and instant PNR confirmation.
          </p>

          {/* Search box */}
          <form onSubmit={handleSearch} className="search-box" noValidate>
            <div className="search-box__title">🔍 Find & Book Trains</div>
            <div className="search-box__grid">
              <div className="search-box__station-wrap">
                <StationInput id="from-station" label="From" value={from} onChange={setFrom} stations={stations} placeholder="City or station" />
                <button type="button" className="search-box__swap" onClick={handleSwap} title="Swap stations" aria-label="Swap departure and arrival">⇄</button>
              </div>
              <StationInput id="to-station" label="To" value={to} onChange={setTo} stations={stations} placeholder="City or station" />
              <div className="form-group">
                <label className="form-label" htmlFor="journey-date">Date</label>
                <input id="journey-date" type="date" className="form-input" value={date} min={today} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                <label className="form-label" style={{ opacity: 0 }}>_</label>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  🔍 Search Trains
                </button>
              </div>
            </div>
          </form>

          <div className="hero__stats">
            <div><div className="hero__stat-value">10M+</div><div className="hero__stat-label">Tickets booked</div></div>
            <div><div className="hero__stat-value">8000+</div><div className="hero__stat-label">Train routes</div></div>
            <div><div className="hero__stat-value">300+</div><div className="hero__stat-label">Stations</div></div>
            <div><div className="hero__stat-value">99.9%</div><div className="hero__stat-label">Uptime</div></div>
          </div>
        </div>
      </section>

      {/* ── Popular Routes ── */}
      <section className="routes-section">
        <div className="container">
          <div className="section-eyebrow">Popular Routes</div>
          <h2 className="section-title">Top Train Connections</h2>
          <p className="section-desc">Explore India's busiest rail corridors — click any route to see live availability.</p>
          <div className="routes-grid">
            {POPULAR_ROUTES.map((r) => (
              <div key={`${r.fromCode}-${r.toCode}`} className="route-card" onClick={() => handleRouteClick(r)} role="button" tabIndex={0}>
                <img className="route-card__img" src={r.img} alt={`${r.from} to ${r.to}`} loading="lazy" />
                <div className="route-card__overlay">
                  <div className="route-card__route">{r.from} → {r.to}</div>
                  <div className="route-card__meta">{r.trains} daily</div>
                </div>
                {r.tag && <div className="route-card__badge">{r.tag}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-eyebrow">Why RailKaro</div>
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>From booking to boarding, we've made the entire rail travel experience seamless.</p>
          </div>
          <div className="features__grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="container">
          <div className="section-eyebrow" style={{ color: 'var(--amber-light)', display: 'inline-block' }}>Get Started Today</div>
          <h2>Ready to Book Your Next Journey?</h2>
          <p>Create a free account and book your first ticket in under 2 minutes.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/register" className="btn btn-primary btn-lg">Create Free Account</a>
            <a href="/search" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}>Search Trains</a>
          </div>
        </div>
      </section>
    </>
  );
}
