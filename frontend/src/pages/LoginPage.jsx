import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/auth.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (k) => (e) => {
    setServerError('');
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await apiLogin(form);
      login(res.data);
      toast.success('Welcome back, ' + res.data.name.split(' ')[0] + '! 👋');
      navigate('/');
    } catch (err) {
      const msg = err.userMessage || err?.response?.data?.message || 'Login failed. Please check your credentials.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container fade-up">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-card__head">
            <Link to="/" className="auth-card__logo">
              <div className="auth-card__logo-icon">🚂</div>
              <span className="auth-card__logo-text">Rail<span>Yatra</span></span>
            </Link>
            <h2 className="auth-card__title">Welcome Back</h2>
            <p className="auth-card__sub">Sign in to manage your bookings</p>
          </div>

          {/* Body */}
          <div className="auth-card__body">

            {/* Server error banner */}
            {serverError && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 'var(--r-md)',
                padding: 'var(--sp-4)', marginBottom: 'var(--sp-4)',
                fontSize: '0.875rem', color: '#dc2626', lineHeight: 1.6
              }}>
                <strong>❌ Error:</strong> {serverError}
                {serverError.includes('server') && (
                  <div style={{ marginTop: 6, color: '#7f1d1d' }}>
                    Make sure both the backend (<code>cd backend &amp;&amp; npm run dev</code>) and
                    MongoDB are running.
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">Email Address</label>
                  <input id="login-email" type="email" className="form-input"
                    placeholder="you@example.com" value={form.email}
                    onChange={set('email')} autoComplete="email" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="login-pwd">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input id="login-pwd" type={showPwd ? 'text' : 'password'} className="form-input"
                      placeholder="Your password" value={form.password}
                      onChange={set('password')} autoComplete="current-password"
                      style={{ paddingRight: 48 }} required />
                    <button type="button" onClick={() => setShowPwd((s) => !s)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: .55 }}>
                      {showPwd ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg"
                  disabled={loading} style={{ width: '100%' }}>
                  {loading ? <span className="spinner spinner--sm" /> : '🔐 Sign In'}
                </button>
              </div>
            </form>

            {/* Demo hint */}
            <div style={{
              marginTop: 'var(--sp-5)', padding: 'var(--sp-4)', borderRadius: 'var(--r-md)',
              background: 'var(--amber-pale)', border: '1px solid var(--border-strong)',
              fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>New here?</strong>{' '}
              Register a free account to get started. Make sure the backend is running first.
            </div>

            <div className="auth-switch" style={{ marginTop: 'var(--sp-5)' }}>
              Don't have an account? <Link to="/register">Create one free →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
