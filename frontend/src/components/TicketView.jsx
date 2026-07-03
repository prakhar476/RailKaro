import { formatDate, formatINR, classLabels } from '../utils/format';

const statusMeta = {
  confirmed: { icon: '✅', label: 'Booking Confirmed', cls: 'confirmed' },
  waitlisted: { icon: '⏳', label: 'Waitlisted', cls: 'waitlisted' },
  cancelled: { icon: '❌', label: 'Cancelled', cls: 'cancelled' },
};

export default function TicketView({ booking }) {
  const { train } = booking;
  const status = statusMeta[booking.bookingStatus] || statusMeta.waitlisted;

  return (
    <div className="ticket fade-up">
      {/* Header */}
      <div className="ticket__header">
        <div className="ticket__logo">Rail<span>Yatra</span></div>
        <div className="ticket__pnr-block">
          <div className="ticket__pnr-label">PNR Number</div>
          <div className="ticket__pnr">{booking.pnr}</div>
        </div>
      </div>

      {/* Status bar */}
      <div className={`ticket__status-bar ${status.cls}`}>
        <span className="ticket__status-icon">{status.icon}</span>
        <span className="ticket__status-text">{status.label}</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', opacity: .7 }}>
          Payment: {booking.paymentStatus.toUpperCase()}
        </span>
      </div>

      {/* Body */}
      <div className="ticket__body">
        {/* Journey */}
        <div className="ticket__journey">
          <div className="ticket__station">
            <div className="ticket__station-code">{train?.source?.code}</div>
            <div className="ticket__station-name">{train?.source?.name}</div>
            <div className="ticket__station-time">{train?.departureTime}</div>
          </div>
          <div className="ticket__middle">
            <div className="ticket__train-num mono">#{train?.trainNumber}</div>
            <div className="ticket__train-name">{train?.trainName}</div>
            <div className="ticket__arrow">→</div>
            <div className="ticket__duration">{train?.duration}</div>
          </div>
          <div className="ticket__station" style={{ textAlign: 'right' }}>
            <div className="ticket__station-code">{train?.destination?.code}</div>
            <div className="ticket__station-name">{train?.destination?.name}</div>
            <div className="ticket__station-time">{train?.arrivalTime}</div>
          </div>
        </div>

        {/* Meta */}
        <div className="ticket__meta">
          <div className="ticket__meta-item">
            <div className="ticket__meta-label">Date of Journey</div>
            <div className="ticket__meta-value">{formatDate(booking.journeyDate)}</div>
          </div>
          <div className="ticket__meta-item">
            <div className="ticket__meta-label">Class</div>
            <div className="ticket__meta-value">{classLabels[booking.classType] || booking.classType}</div>
          </div>
          <div className="ticket__meta-item">
            <div className="ticket__meta-label">Passengers</div>
            <div className="ticket__meta-value">{booking.passengers.length}</div>
          </div>
          <div className="ticket__meta-item">
            <div className="ticket__meta-label">Booked On</div>
            <div className="ticket__meta-value">{formatDate(booking.createdAt)}</div>
          </div>
        </div>

        {/* Passengers table */}
        <div className="ticket__passengers">
          <div className="ticket__passengers-head">
            <span>Passenger Name</span>
            <span>Age</span>
            <span>Gender</span>
            <span>Seat / Berth</span>
          </div>
          {booking.passengers.map((p, i) => (
            <div className="ticket__passenger-row" key={i}>
              <span>{p.name}</span>
              <span>{p.age}</span>
              <span>{p.gender}</span>
              <span className="ticket__passenger-seat">
                {p.seatNumber ? `${p.seatNumber} · ${p.berth}` : 'WL'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="ticket__footer">
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Contact: {booking.contactPhone} · {booking.contactEmail}
        </div>
        <div className="ticket__fare">
          Total Fare: <span>{formatINR(booking.totalFare)}</span>
        </div>
      </div>
    </div>
  );
}
