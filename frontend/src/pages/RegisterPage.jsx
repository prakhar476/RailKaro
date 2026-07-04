import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as apiRegister } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/auth.css';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (k) => (e) => {
    setServerError('');
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim())             { toast.error('Full name is required'); return false; }
    if (!form.email.includes('@'))     { toast.error('Valid email address required'); return false; }
    if (!/^\d{10}$/.test(form.phone)) { toast.error('Enter a valid 10-digit phone number'); return false; }
    if (form.password.length < 6)     { toast.error('Password must be at least 6 characters'); return false; }
    if (form.password !== form.confirm){ toast.error('Passwords do not match'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await apiRegister({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      login(res.data);
      toast.success('Account created! Welcome aboard, ' + res.data.name.split(' ')[0] + '! 🎉');
      navigate('/');
    } catch (err) {
      const msg = err.userMessage || err?.response?.data?.message || 'Registration failed. Please try again.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const strengthLevel = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6)            score++;
    if (pwd.length >= 10)           score++;
    if (/[A-Z]/.test(pwd))         score++;
    if (/[0-9]/.test(pwd))         score++;
    if (/[^A-Za-z0-9]/.test(pwd))  score++;
    return Math.min(score, 4);
  };

  const strength = strengthLevel(form.password);
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="auth-page">
      <div className="auth-container fade-up">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-card__head">
            <Link to="/" className="auth-card__logo">
              <div className="auth-card__logo-icon">🚂</div>
              <span className="auth-card__logo-text">Rail<span>Karo</span></span>
            </Link>
            <h2 className="auth-card__title">Create Account</h2>
            <p className="auth-card__sub">Book your first train ticket in minutes</p>
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
                    MongoDB are running before registering.
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-name">Full Name</label>
                  <input id="reg-name" type="text" className="form-input"
                    placeholder="As on your ID card" value={form.name}
                    onChange={set('name')} autoComplete="name" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-email">Email Address</label>
                  <input id="reg-email" type="email" className="form-input"
                    placeholder="you@example.com" value={form.email}
                    onChange={set('email')} autoComplete="email" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-phone">Mobile Number</label>
                  <input id="reg-phone" type="tel" className="form-input"
                    placeholder="10-digit number" value={form.phone}
                    onChange={set('phone')} autoComplete="tel" maxLength={10} required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-pwd">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input id="reg-pwd" type={showPwd ? 'text' : 'password'} className="form-input"
                      placeholder="Min. 6 characters" value={form.password}
                      onChange={set('password')} autoComplete="new-password"
                      style={{ paddingRight: 48 }} required />
                    <button type="button" onClick={() => setShowPwd((s) => !s)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: .55 }}>
                      {showPwd ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {form.password && (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {[1, 2, 3, 4].map((lvl) => (
                          <div key={lvl} style={{
                            flex: 1, height: 4, borderRadius: 2,
                            background: strength >= lvl ? strengthColors[strength] : 'var(--border)',
                            transition: 'background .2s'
                          }} />
                        ))}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: strengthColors[strength], marginTop: 3, fontWeight: 600 }}>
                        {strengthLabels[strength]}
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
                  <input id="reg-confirm" type="password"
                    className={'form-input' + (form.confirm && form.confirm !== form.password ? ' error' : '')}
                    placeholder="Repeat password" value={form.confirm}
                    onChange={set('confirm')} autoComplete="new-password" required />
                  {form.confirm && form.confirm !== form.password && (
                    <span style={{ fontSize: '0.775rem', color: 'var(--red)', marginTop: 2 }}>
                      Passwords don't match
                    </span>
                  )}
                </div>

                <button type="submit" className="btn btn-primary btn-lg"
                  disabled={loading} style={{ width: '100%', marginTop: 'var(--sp-2)' }}>
                  {loading ? <span className="spinner spinner--sm" /> : '🚂 Create Account'}
                </button>
              </div>
            </form>

            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--sp-4)', lineHeight: 1.6 }}>
              By signing up you agree to our Terms of Service and Privacy Policy.
            </p>

            <div className="auth-switch">
              Already have an account? <Link to="/login">Sign in →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
