import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/format';
import toast from 'react-hot-toast';

export default function TrainCard({ train, journeyDate }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBook = () => {
    if (!selectedClass) { toast.error('Please select a travel class first'); return; }
    if (!isAuthenticated) { toast.error('Please log in to book tickets'); navigate('/login'); return; }
    navigate('/book', { state: { train, selectedClass, journeyDate } });
  };

  return (
    <div className="train-card fade-up">
      {/* Header row */}
      <div className="train-card__header">
        <div className="train-card__name-block">
          <div className="train-card__number mono">#{train.trainNumber}</div>
          <div className="train-card__name">{train.trainName}</div>
        </div>

        {/* Journey timeline */}
        <div className="train-card__journey">
          <div className="train-card__time">
            <div className="train-card__time-value mono">{train.departureTime}</div>
            <div className="train-card__time-station">{train.source.code}</div>
          </div>
          <div className="train-card__line">
            <div className="train-card__duration">{train.duration}</div>
            <div className="train-card__track" />
            <div className="train-card__distance">{train.distance} km</div>
          </div>
          <div className="train-card__time">
            <div className="train-card__time-value mono">{train.arrivalTime}</div>
            <div className="train-card__time-station">{train.destination.code}</div>
          </div>
        </div>

        {/* Rating + days */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div className="train-card__rating">★ {train.rating}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6, maxWidth: 180, textAlign:'right' }}>
            Runs: {train.runsOn.join(' · ')}
          </div>
        </div>
      </div>

      {/* Classes */}
      <div className="train-card__classes">
        <div className="train-card__class-pills">
          {train.classes.map((cls) => {
            const avail = cls.availableSeats;
            const isSelected = selectedClass?.type === cls.type;
            return (
              <div
                key={cls.type}
                className={`class-pill${isSelected ? ' selected' : ''}${avail === 0 ? ' disabled' : ''}`}
                onClick={() => avail > 0 && setSelectedClass(cls)}
                role="button"
                tabIndex={0}
              >
                <div className="class-pill__type">{cls.type}</div>
                <div className="class-pill__fare">{formatINR(cls.fare)}</div>
                <div className={`class-pill__avail ${avail > 0 ? 'avail' : 'wl'}`}>
                  {avail > 0 ? `${avail} Avail` : 'WL'}
                </div>
              </div>
            );
          })}
        </div>

        <button className="btn btn-primary" onClick={handleBook} disabled={!selectedClass}>
          {selectedClass ? `Book ${selectedClass.type}` : 'Select Class'}
        </button>
      </div>
    </div>
  );
}
