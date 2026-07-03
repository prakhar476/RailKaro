import { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';

/**
 * Shows a dismissible warning banner when the backend API is unreachable.
 * Disappears automatically once the server comes online.
 */
export default function ServerStatus() {
  const [status, setStatus] = useState('checking'); // 'checking' | 'ok' | 'down'
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let timer;

    const check = async () => {
      try {
        await checkHealth();
        setStatus('ok');
      } catch {
        setStatus('down');
        // Retry every 8 seconds
        timer = setTimeout(check, 8000);
      }
    };

    check();
    return () => clearTimeout(timer);
  }, []);

  if (status !== 'down' || dismissed) return null;

  return (
    <div style={{
      background: '#7f1d1d',
      color: '#fef2f2',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      zIndex: 999,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: '1.125rem' }}>⚠️</span>
        <span>
          <strong>Backend server is not reachable.</strong>{' '}
          Open a terminal, run{' '}
          <code style={{ background: 'rgba(255,255,255,.15)', padding: '1px 6px', borderRadius: 4 }}>
            cd backend &amp;&amp; npm run dev
          </code>
          {' '}and make sure MongoDB is running.{' '}
          <a
            href="http://localhost:5000/api/health"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#fca5a5', textDecoration: 'underline' }}
          >
            Check API health ↗
          </a>
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '1.25rem', flexShrink: 0 }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
