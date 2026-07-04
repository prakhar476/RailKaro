import { useState, useEffect } from 'react';

export default function DisclaimerModal() {
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [shake, setShake]     = useState(false);

  useEffect(() => {
    // Show once per browser session
    if (!sessionStorage.getItem('railKaro_disclaimer_accepted')) {
      // Small delay so the page renders first
      const t = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAccept = () => {
    if (!checked) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    sessionStorage.setItem('railKaro_disclaimer_accepted', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(10, 10, 20, 0.88)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeInBg .3s ease both',
      }}>

        {/* Modal card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '540px',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,.55)',
          animation: 'slideUp .35s cubic-bezier(.4,0,.2,1) both',
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #252540 100%)',
            borderBottom: '3px solid #f5a623',
            padding: '28px 32px 24px',
            textAlign: 'center',
          }}>
            {/* Icon */}
            <div style={{
              width: 64, height: 64,
              background: 'rgba(245,166,35,.15)',
              border: '2px solid rgba(245,166,35,.4)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '1.75rem',
            }}>
              ⚠️
            </div>

            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: '#f5a623',
              marginBottom: '8px',
            }}>
              Important Notice
            </div>

            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: '#ffffff',
              fontSize: '1.375rem',
              fontWeight: 700,
              lineHeight: 1.3,
              margin: 0,
            }}>
              This is NOT an Official Website
            </h2>
          </div>

          {/* Body */}
          <div style={{ padding: '28px 32px' }}>

            {/* Main disclaimer box */}
            <div style={{
              background: '#fff8eb',
              border: '1.5px solid #f5a623',
              borderRadius: '12px',
              padding: '18px 20px',
              marginBottom: '20px',
            }}>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1rem',
                fontWeight: 700,
                color: '#1a1a2e',
                marginBottom: '8px',
              }}>
                🚂 RailKaro — Student / Developer Project
              </p>
              <p style={{
                fontSize: '0.9rem',
                color: '#4a4a6a',
                lineHeight: 1.75,
                margin: 0,
              }}>
                This website is <strong>not affiliated</strong> with Indian Railways, IRCTC,
                or any official government body. It is a <strong>demonstration project</strong> built
                purely for educational and portfolio purposes.
              </p>
            </div>

            {/* Bullet points */}
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              {[
                { icon: '❌', text: 'No real train tickets are issued here' },
                { icon: '❌', text: 'No real payments are processed' },
                { icon: '❌', text: 'PNR numbers generated are fictitious' },
                { icon: '✅', text: 'Safe to explore — all data is local & simulated' },
                { icon: '✅', text: 'Built with React, Node.js & MongoDB for learning' },
              ].map((item, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '0.875rem',
                  color: '#4a4a6a',
                  lineHeight: 1.5,
                }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>

            {/* Official site nudge */}
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '0.8125rem',
              color: '#1d4ed8',
              marginBottom: '22px',
              lineHeight: 1.6,
            }}>
              For real train bookings, visit the official website:{' '}
              <a
                href="https://www.irctc.co.in"
                target="_blank"
                rel="noreferrer"
                style={{ fontWeight: 700, color: '#1d4ed8', textDecoration: 'underline' }}
              >
                www.irctc.co.in ↗
              </a>
            </div>

            {/* Checkbox */}
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              cursor: 'pointer',
              marginBottom: '22px',
              animation: shake ? 'shake .5s ease' : 'none',
            }}>
              <div
                onClick={() => setChecked(c => !c)}
                style={{
                  width: '20px', height: '20px',
                  borderRadius: '5px',
                  border: checked ? '2px solid #f5a623' : '2px solid #c8b896',
                  background: checked ? '#f5a623' : '#ffffff',
                  flexShrink: 0,
                  marginTop: '1px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .15s ease',
                  cursor: 'pointer',
                }}
              >
                {checked && (
                  <span style={{ color: '#1a1a2e', fontSize: '0.75rem', fontWeight: 900, lineHeight: 1 }}>✓</span>
                )}
              </div>
              <span style={{
                fontSize: '0.875rem',
                color: '#4a4a6a',
                lineHeight: 1.6,
                userSelect: 'none',
              }}>
                I understand that this is a <strong>student/demo project</strong> and not an
                official train booking service. I will not use it for real travel planning.
              </span>
            </label>

            {/* Accept button */}
            <button
              onClick={handleAccept}
              style={{
                width: '100%',
                padding: '14px',
                background: checked ? '#f5a623' : '#e2d9c5',
                color: checked ? '#1a1a2e' : '#8888aa',
                border: 'none',
                borderRadius: '10px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1rem',
                fontWeight: 700,
                cursor: checked ? 'pointer' : 'not-allowed',
                transition: 'all .2s ease',
                boxShadow: checked ? '0 4px 16px rgba(245,166,35,.40)' : 'none',
                letterSpacing: '0.01em',
              }}
            >
              {checked ? '✅ I Understand — Enter RailKaro' : '☑️ Please check the box above first'}
            </button>

            {/* Footer note */}
            <p style={{
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#8888aa',
              marginTop: '14px',
              marginBottom: 0,
              lineHeight: 1.5,
            }}>
              This disclaimer will appear once per session. &nbsp;·&nbsp;
              Project by a developer for learning purposes only.
            </p>
          </div>
        </div>
      </div>

      {/* Keyframe animations injected via a style tag */}
      <style>{`
        @keyframes fadeInBg {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px) scale(.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
      `}</style>
    </>
  );
}
