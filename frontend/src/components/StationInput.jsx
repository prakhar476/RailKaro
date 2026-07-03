import { useState, useRef, useEffect } from 'react';

export default function StationInput({ label, value, onChange, stations, placeholder, id }) {
  const [query, setQuery] = useState(value?.name || '');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const filtered = query.length < 1 ? [] : stations.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.code.toLowerCase().includes(query.toLowerCase()) ||
    s.city.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (value?.name) setQuery(value.name);
  }, [value]);

  const select = (station) => {
    setQuery(station.name);
    onChange(station);
    setOpen(false);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setOpen(true);
    if (!e.target.value) onChange(null);
  };

  return (
    <div className="form-group" style={{ position: 'relative' }} ref={wrapRef}>
      <label className="form-label" htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        className="form-input"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="station-dropdown" role="listbox">
          {filtered.map((s) => (
            <div key={s.code} className="station-dropdown__item" role="option" onClick={() => select(s)}>
              <span className="station-dropdown__code">{s.code}</span>
              <div className="station-dropdown__info">
                <div className="station-dropdown__name">{s.name}</div>
                <div className="station-dropdown__city">{s.city}, {s.state}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
