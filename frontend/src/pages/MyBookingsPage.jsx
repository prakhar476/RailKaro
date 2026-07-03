import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, cancelBooking } from '../services/api';
import TicketView from '../components/TicketView';
import { formatDate, formatINR, statusColor } from '../utils/format';
import toast from 'react-hot-toast';
import '../styles/auth.css';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewTicket, setViewTicket] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    getMyBookings()
      .then((res) => setBookings(res.data))
      .catch(() => toast.error('Could not load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (booking) => {
    if (!window.confirm(`Cancel booking PNR ${booking.pnr}? This cannot be undone.`)) return;
    setCancellingId(booking._id);
    try {
      const res = await cancelBooking(booking._id);
      setBookings((prev) => prev.map((b) => (b._id === booking._id ? res.data : b)));
      if (viewTicket?._id === booking._id) setViewTicket(res.data);
      toast.success('Booking cancelled successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not cancel booking');
    } finally { setCancellingId(null); }
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'confirmed', label: '✅ Confirmed' },
    { key: 'waitlisted', label: '⏳ Waitlisted' },
    { key: 'cancelled', label: '❌ Cancelled' },
  ];

  const filtered = activeFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.bookingStatus === activeFilter);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.bookingStatus === 'confirmed').length,
    upcoming: bookings.filter((b) => b.bookingStatus === 'confirmed' && new Date(b.journeyDate) >= new Date()).length,
    spent: bookings.filter((b) => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalFare, 0),
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner spinner--lg" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">

        {/* User header */}
        <div className="dashboard-head">
          <div className="dashboard-head__user">
            <div className="dashboard-head__avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className="dashboard-head__name">{user?.name}</div>
              <div className="dashboard-head__email">{user?.email} · {user?.phone}</div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)'
        }}>
          {[
            { label: 'Total Bookings', value: stats.total, icon: '🎟️' },
            { label: 'Confirmed', value: stats.confirmed, icon: '✅' },
            { label: 'Upcoming Trips', value: stats.upcoming, icon: '🚂' },
            { label: 'Total Spent', value: formatINR(stats.spent), icon: '💰' },
          ].map((s) => (
            <div key={s.label} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)', padding: 'var(--sp-5)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '1.375rem', marginBottom: 'var(--sp-2)' }}>{s.icon}</div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Ticket detail view (modal-style) */}
        {viewTicket && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15,15,26,.7)',
            zIndex: 200, display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center', padding: 'var(--sp-8) var(--sp-4)',
            overflowY: 'auto', backdropFilter: 'blur(4px)'
          }}>
            <div style={{ width: '100%', maxWidth: 760 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--sp-3)' }}>
                <button
                  className="btn btn-outline"
                  onClick={() => setViewTicket(null)}
                  style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}
                >
                  ✕ Close
                </button>
              </div>
              <TicketView booking={viewTicket} />
              <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center', marginTop: 'var(--sp-4)' }}>
                <button className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)' }} onClick={() => window.print()}>
                  🖨️ Print Ticket
                </button>
                {viewTicket.bookingStatus !== 'cancelled' && (
                  <button
                    className="btn btn-danger"
                    onClick={() => { handleCancel(viewTicket); setViewTicket(null); }}
                  >
                    ❌ Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-4)', marginBottom: 'var(--sp-5)' }}>
          <h2 style={{ margin: 0 }}>My Bookings</h2>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            {filters.map((f) => (
              <button
                key={f.key}
                className={`btn btn-sm ${activeFilter === f.key ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state__icon">🎟️</div>
            <h3 className="empty-state__title">
              {bookings.length === 0 ? 'No bookings yet' : `No ${activeFilter} bookings`}
            </h3>
            <p className="empty-state__desc">
              {bookings.length === 0
                ? 'Book your first train ticket and it will appear here.'
                : `You have no bookings with status "${activeFilter}".`}
            </p>
            {bookings.length === 0 && (
              <Link to="/search" className="btn btn-primary" style={{ marginTop: 'var(--sp-5)' }}>
                🔍 Search Trains
              </Link>
            )}
          </div>
        )}

        {/* Booking list */}
        <div className="booking-list">
          {filtered.map((b) => {
            const color = statusColor(b.bookingStatus);
            const isCancelling = cancellingId === b._id;
            const train = b.train || {};
            return (
              <div key={b._id} className="booking-item">
                {/* Header */}
                <div className="booking-item__header">
                  <div className="booking-item__pnr">
                    PNR: <strong>{b.pnr}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
                    <span className={`badge badge-${color}`}>
                      {b.bookingStatus.charAt(0).toUpperCase() + b.bookingStatus.slice(1)}
                    </span>
                    <span className={`badge badge-${statusColor(b.paymentStatus)}`}>
                      Payment: {b.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="booking-item__body">
                  <div className="booking-item__route">
                    <div>
                      <div className="booking-item__station-code">{train.source?.code}</div>
                      <div className="booking-item__station-name">{train.source?.name}</div>
                    </div>
                    <div className="booking-item__arrow">→</div>
                    <div>
                      <div className="booking-item__station-code">{train.destination?.code}</div>
                      <div className="booking-item__station-name">{train.destination?.name}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="booking-item__detail">
                      🚂 <strong>{train.trainName}</strong> #{train.trainNumber}
                    </div>
                    <div className="booking-item__detail">
                      📅 <strong>{formatDate(b.journeyDate)}</strong>
                    </div>
                    <div className="booking-item__detail">
                      🕐 {train.departureTime} → {train.arrivalTime}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="booking-item__detail">
                      🎫 Class: <strong>{b.classType}</strong>
                    </div>
                    <div className="booking-item__detail">
                      👥 {b.passengers.length} passenger{b.passengers.length > 1 ? 's' : ''}
                    </div>
                    <div className="booking-item__detail" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--amber-dark)' }}>
                      {formatINR(b.totalFare)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="booking-item__actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setViewTicket(b)}
                  >
                    🎟️ View Ticket
                  </button>
                  {b.bookingStatus !== 'cancelled' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(b)}
                      disabled={isCancelling}
                    >
                      {isCancelling ? <span className="spinner spinner--sm" /> : '❌ Cancel'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
