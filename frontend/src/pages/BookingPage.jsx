import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBooking, payForBooking } from '../services/api';
import TicketView from '../components/TicketView';
import { formatINR, formatDate, classLabels } from '../utils/format';
import toast from 'react-hot-toast';
import '../styles/booking.css';

const STEPS = ['Passengers', 'Review', 'Payment', 'Ticket'];

const emptyPassenger = () => ({ name: '', age: '', gender: 'Male' });

export default function BookingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { train, selectedClass, journeyDate } = state || {};

  const [step, setStep] = useState(0);
  const [passengers, setPassengers] = useState([emptyPassenger()]);
  const [contact, setContact] = useState({ email: user?.email || '', phone: user?.phone || '' });
  const [payMethod, setPayMethod] = useState('upi');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!train || !selectedClass) {
    return (
      <div className="container" style={{ padding: 'var(--sp-16) 0', textAlign: 'center' }}>
        <div className="empty-state">
          <div className="empty-state__icon">⚠️</div>
          <h3 className="empty-state__title">No train selected</h3>
          <p className="empty-state__desc">Please search for trains and select one to book.</p>
          <button className="btn btn-primary" style={{ marginTop: 'var(--sp-5)' }} onClick={() => navigate('/search')}>Search Trains</button>
        </div>
      </div>
    );
  }

  const totalFare = selectedClass.fare * passengers.length;

  const updatePassenger = (idx, field, val) => {
    setPassengers(ps => ps.map((p, i) => i === idx ? { ...p, [field]: val } : p));
  };

  const addPassenger = () => {
    if (passengers.length >= 6) { toast.error('Maximum 6 passengers per booking'); return; }
    setPassengers(ps => [...ps, emptyPassenger()]);
  };

  const removePassenger = (idx) => {
    if (passengers.length <= 1) return;
    setPassengers(ps => ps.filter((_, i) => i !== idx));
  };

  const validatePassengers = () => {
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name.trim()) { toast.error(`Passenger ${i + 1}: name is required`); return false; }
      if (!p.age || isNaN(p.age) || +p.age < 1 || +p.age > 120) { toast.error(`Passenger ${i + 1}: invalid age`); return false; }
    }
    if (!contact.email.includes('@')) { toast.error('Valid contact email required'); return false; }
    if (contact.phone.length < 10) { toast.error('Valid 10-digit phone number required'); return false; }
    return true;
  };

  const handleProceedToReview = () => {
    if (validatePassengers()) setStep(1);
  };

  const handleProceedToPayment = () => setStep(2);

  const handlePay = async () => {
    setLoading(true);
    try {
      // 1. Create booking
      const bRes = await createBooking({
        trainId: train._id,
        journeyDate,
        classType: selectedClass.type,
        passengers: passengers.map(p => ({ ...p, age: +p.age })),
        contactEmail: contact.email,
        contactPhone: contact.phone,
      });
      const createdBooking = bRes.data;

      // 2. Simulate payment
      const pRes = await payForBooking(createdBooking._id);

      // Merge train info for display
      setBooking({ ...pRes.data, train });
      setStep(3);
      toast.success('Booking confirmed! 🎉');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="booking-page">
      <div className="container">
        {/* Steps */}
        <div className="booking-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`booking-step${i < step ? ' booking-step--done' : ''}${i === step ? ' booking-step--active' : ''}`}>
              <div className="booking-step__num">{i < step ? '✓' : i + 1}</div>
              <div className="booking-step__label">{s}</div>
            </div>
          ))}
        </div>

        {/* ── Step 0: Passengers ── */}
        {step === 0 && (
          <div className="booking-grid">
            <div>
              <div className="passenger-section">
                <div className="passenger-section__head">
                  <h3>Passenger Details</h3>
                  <button className="btn btn-outline btn-sm" onClick={addPassenger}>+ Add Passenger</button>
                </div>
                <div className="passenger-form">
                  {passengers.map((p, i) => (
                    <div className="passenger-block" key={i}>
                      <div className="passenger-block__header">
                        <div className="passenger-block__label">
                          <div className="passenger-block__num">{i + 1}</div>
                          Passenger {i + 1}
                        </div>
                        {passengers.length > 1 && (
                          <button className="btn btn-ghost btn-sm" onClick={() => removePassenger(i)} style={{ color: 'var(--red)' }}>✕ Remove</button>
                        )}
                      </div>
                      <div className="passenger-block__grid">
                        <div className="form-group">
                          <label className="form-label">Full Name</label>
                          <input className="form-input" type="text" placeholder="As on ID card" value={p.name} onChange={e => updatePassenger(i, 'name', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Age</label>
                          <input className="form-input" type="number" placeholder="Age" min="1" max="120" value={p.age} onChange={e => updatePassenger(i, 'age', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Gender</label>
                          <select className="form-input form-select" value={p.gender} onChange={e => updatePassenger(i, 'gender', e.target.value)}>
                            <option>Male</option><option>Female</option><option>Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="divider" />
                  <h4 style={{ marginBottom: 'var(--sp-4)' }}>Contact Information</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input className="form-input" type="email" placeholder="your@email.com" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mobile Number</label>
                      <input className="form-input" type="tel" placeholder="10-digit number" value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} />
                    </div>
                  </div>

                  <div style={{ marginTop: 'var(--sp-6)' }}>
                    <button className="btn btn-primary btn-lg" onClick={handleProceedToReview} style={{ width: '100%' }}>
                      Continue to Review →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <BookingSidebar train={train} selectedClass={selectedClass} journeyDate={journeyDate} passengers={passengers} totalFare={totalFare} />
          </div>
        )}

        {/* ── Step 1: Review ── */}
        {step === 1 && (
          <div className="booking-grid">
            <div>
              <div className="passenger-section">
                <div className="passenger-section__head"><h3>Review Your Booking</h3></div>
                <div className="passenger-form">
                  <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-md)', padding: 'var(--sp-5)', border: '1px solid var(--border)', marginBottom: 'var(--sp-5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--space)', fontWeight: 700, fontSize: '1.0625rem' }}>
                          {train.source.code} → {train.destination.code}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>{train.trainName} · #{train.trainNumber}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                          {train.departureTime} – {train.arrivalTime}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{formatDate(journeyDate)}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
                      <span className="badge badge-amber">Class: {classLabels[selectedClass.type] || selectedClass.type}</span>
                      <span className="badge badge-blue">{passengers.length} passenger{passengers.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <h4 style={{ marginBottom: 'var(--sp-4)' }}>Passengers</h4>
                  <div className="ticket__passengers" style={{ marginBottom: 'var(--sp-5)' }}>
                    <div className="ticket__passengers-head" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr' }}>
                      <span>Name</span><span>Age</span><span>Gender</span>
                    </div>
                    {passengers.map((p, i) => (
                      <div className="ticket__passenger-row" key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr' }}>
                        <span>{p.name}</span><span>{p.age}</span><span>{p.gender}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                    <button className="btn btn-outline" onClick={() => setStep(0)}>← Edit</button>
                    <button className="btn btn-primary btn-lg" onClick={handleProceedToPayment} style={{ flex: 1 }}>
                      Proceed to Payment →
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <BookingSidebar train={train} selectedClass={selectedClass} journeyDate={journeyDate} passengers={passengers} totalFare={totalFare} />
          </div>
        )}

        {/* ── Step 2: Payment ── */}
        {step === 2 && (
          <div className="booking-grid">
            <div>
              <div className="payment-section">
                <div className="passenger-section__head" style={{ padding: 'var(--sp-5) var(--sp-6)', borderBottom: '1px solid var(--border)' }}>
                  <h3>Choose Payment Method</h3>
                </div>
                <div className="payment-methods">
                  {[
                    { id: 'upi', icon: '📲', name: 'UPI', desc: 'Pay via Google Pay, PhonePe, BHIM, Paytm' },
                    { id: 'card', icon: '💳', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                    { id: 'netbanking', icon: '🏦', name: 'Net Banking', desc: 'All major Indian banks supported' },
                    { id: 'wallet', icon: '👛', name: 'Digital Wallet', desc: 'Paytm, Amazon Pay, Mobikwik' },
                  ].map(m => (
                    <div key={m.id} className={`payment-method${payMethod === m.id ? ' selected' : ''}`} onClick={() => setPayMethod(m.id)}>
                      <div className="payment-method__icon">{m.icon}</div>
                      <div>
                        <div className="payment-method__name">{m.name}</div>
                        <div className="payment-method__desc">{m.desc}</div>
                      </div>
                      <div className={`payment-radio${payMethod === m.id ? ' checked' : ''}`} />
                    </div>
                  ))}

                  <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-md)', padding: 'var(--sp-4)', border: '1px dashed var(--border)', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    🔒 This is a demo — no real payment is processed. Click below to simulate successful payment.
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-2)' }}>
                    <button className="btn btn-outline" onClick={() => setStep(1)} disabled={loading}>← Back</button>
                    <button className="btn btn-primary btn-lg" onClick={handlePay} disabled={loading} style={{ flex: 1 }}>
                      {loading ? <span className="spinner spinner--sm" /> : `✔ Pay ${formatINR(totalFare)}`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <BookingSidebar train={train} selectedClass={selectedClass} journeyDate={journeyDate} passengers={passengers} totalFare={totalFare} />
          </div>
        )}

        {/* ── Step 3: Ticket ── */}
        {step === 3 && booking && (
          <div className="fade-up">
            <div style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
              <div style={{ fontSize: '3rem' }}>🎉</div>
              <h2 style={{ marginTop: 'var(--sp-3)' }}>Booking Confirmed!</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--sp-2)' }}>Your ticket has been issued. Safe travels!</p>
            </div>
            <TicketView booking={booking} />
            <div style={{ display: 'flex', gap: 'var(--sp-4)', justifyContent: 'center', marginTop: 'var(--sp-6)' }}>
              <button className="btn btn-outline" onClick={() => window.print()}>🖨️ Print Ticket</button>
              <button className="btn btn-primary" onClick={() => navigate('/my-bookings')}>📋 My Bookings</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BookingSidebar({ train, selectedClass, journeyDate, passengers, totalFare }) {
  return (
    <div className="booking-summary">
      <div className="booking-summary__head">
        <div className="booking-summary__head-icon">🎟️</div>
        <div className="booking-summary__head-title">Booking Summary</div>
      </div>
      <div className="booking-summary__body">
        <div className="booking-summary__route">
          <div className="booking-summary__route-from">{train.source.code}</div>
          <div className="booking-summary__route-arrow">↓</div>
          <div className="booking-summary__route-to">{train.destination.code}</div>
        </div>
        {[
          ['Train', train.trainName],
          ['Number', `#${train.trainNumber}`],
          ['Date', formatDate(journeyDate)],
          ['Departure', train.departureTime],
          ['Arrival', train.arrivalTime],
          ['Class', classLabels[selectedClass.type] || selectedClass.type],
          ['Passengers', passengers.length],
          ['Fare / Pax', formatINR(selectedClass.fare)],
        ].map(([label, val]) => (
          <div className="booking-summary__row" key={label}>
            <span className="booking-summary__row-label">{label}</span>
            <span className="booking-summary__row-value">{val}</span>
          </div>
        ))}
        <div className="booking-summary__total">
          <span className="booking-summary__total-label">Total Fare</span>
          <span className="booking-summary__total-amount">{formatINR(totalFare)}</span>
        </div>
        <div style={{ marginTop: 'var(--sp-4)', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          ✅ Instant confirmation &nbsp;·&nbsp; 📧 E-ticket on email &nbsp;·&nbsp; 🔄 Refundable
        </div>
      </div>
    </div>
  );
}
