import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import TrainCard from '../components/TrainCard';
import StationInput from '../components/StationInput';
import { searchTrains, getStations } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/home.css';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [date, setDate] = useState(() => params.get('date') || new Date().toISOString().split('T')[0]);
  const [sort, setSort] = useState('departure');
  const [classFilter, setClassFilter] = useState('All');

  useEffect(() => { getStations().then(d => setStations(d.data)).catch(() => {}); }, []);

  const doSearch = useCallback(async (fromCode, toCode, d) => {
    if (!fromCode || !toCode) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchTrains(fromCode, toCode);
      setTrains(data.data);
    } catch {
      toast.error('Could not fetch trains. Is the backend running?');
      setTrains([]);
    } finally { setLoading(false); }
  }, []);

  // Auto-search from URL params on mount
  useEffect(() => {
    const fromCode = params.get('from');
    const toCode = params.get('to');
    const fromName = params.get('fromName');
    const toName = params.get('toName');
    if (fromCode) {
      const f = { code: fromCode, name: fromName || fromCode };
      const t = { code: toCode, name: toName || toCode };
      setFrom(f); setTo(t);
      doSearch(fromCode, toCode, params.get('date'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from) { toast.error('Select departure station'); return; }
    if (!to)   { toast.error('Select destination station'); return; }
    if (from.code === to.code) { toast.error('Stations must differ'); return; }
    doSearch(from.code, to.code, date);
  };

  const handleSwap = () => { const tmp = from; setFrom(to); setTo(tmp); };

  // Sort & filter
  const classes = ['All', ...new Set(trains.flatMap(t => t.classes.map(c => c.type)))];
  let display = trains.filter(t => classFilter === 'All' || t.classes.some(c => c.type === classFilter));
  if (sort === 'departure') display = [...display].sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  if (sort === 'duration')  display = [...display].sort((a, b) => a.duration.localeCompare(b.duration));
  if (sort === 'price')     display = [...display].sort((a, b) => Math.min(...a.classes.map(c=>c.fare)) - Math.min(...b.classes.map(c=>c.fare)));
  if (sort === 'rating')    display = [...display].sort((a, b) => b.rating - a.rating);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ padding: 'var(--sp-8) 0 var(--sp-16)', minHeight: '80vh' }}>
      <div className="container">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="search-box" style={{ marginBottom: 'var(--sp-8)' }} noValidate>
          <div className="search-box__grid">
            <div className="search-box__station-wrap">
              <StationInput id="sp-from" label="From" value={from} onChange={setFrom} stations={stations} placeholder="Departure station" />
              <button type="button" className="search-box__swap" onClick={handleSwap} aria-label="Swap stations">⇄</button>
            </div>
            <StationInput id="sp-to" label="To" value={to} onChange={setTo} stations={stations} placeholder="Destination station" />
            <div className="form-group">
              <label className="form-label" htmlFor="sp-date">Date</label>
              <input id="sp-date" type="date" className="form-input" value={date} min={today} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
              <label className="form-label" style={{ opacity: 0 }}>_</label>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>🔍 Search</button>
            </div>
          </div>
        </form>

        {/* Sort / Filter toolbar */}
        {trains.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-4)', marginBottom: 'var(--sp-5)' }}>
            <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>CLASS:</span>
              {classes.map(c => (
                <button key={c} className={`btn btn-sm ${classFilter === c ? 'btn-primary' : 'btn-outline'}`} onClick={() => setClassFilter(c)}>{c}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>SORT:</span>
              <select className="form-input form-select" style={{ width: 'auto', padding: '6px 36px 6px 12px' }} value={sort} onChange={e => setSort(e.target.value)}>
                <option value="departure">Earliest Departure</option>
                <option value="duration">Shortest Duration</option>
                <option value="price">Lowest Fare</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        )}

        {/* Results heading */}
        {searched && !loading && (
          <div style={{ marginBottom: 'var(--sp-5)' }}>
            {display.length > 0
              ? <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}><strong style={{ color: 'var(--text-primary)' }}>{display.length}</strong> train{display.length !== 1 ? 's' : ''} found</p>
              : <div className="empty-state"><div className="empty-state__icon">🚉</div><h3 className="empty-state__title">No trains found</h3><p className="empty-state__desc">Try a different route or date. <Link to="/" style={{ color: 'var(--amber-dark)', fontWeight: 600 }}>Go back home</Link></p></div>
            }
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--sp-16) 0' }}>
            <div className="spinner spinner--lg" />
          </div>
        )}

        {/* Train list */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {display.map(train => (
              <TrainCard key={train._id} train={train} journeyDate={date} />
            ))}
          </div>
        )}

        {/* Prompt if empty form */}
        {!searched && !loading && (
          <div className="empty-state">
            <div className="empty-state__icon">🔍</div>
            <h3 className="empty-state__title">Search for Trains</h3>
            <p className="empty-state__desc">Enter your departure and destination stations above to see available trains.</p>
          </div>
        )}
      </div>
    </div>
  );
}
