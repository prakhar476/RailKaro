import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const close = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">🚂</div>
          <span className="navbar__logo-text">Rail<span>Yatra</span></span>
        </Link>

        {/* Centre links */}
        <div className="navbar__links">
          <NavLink to="/" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`} end>Home</NavLink>
          <NavLink to="/search" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>Search Trains</NavLink>
          <NavLink to="/pnr" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>PNR Status</NavLink>
          {isAuthenticated && (
            <NavLink to="/my-bookings" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>My Bookings</NavLink>
          )}
        </div>

        {/* Right actions */}
        <div className="navbar__actions">
          {isAuthenticated ? (
            <div className="navbar__user" ref={dropRef}>
              <button className="navbar__user-btn" onClick={() => setDropOpen(o => !o)} aria-expanded={dropOpen}>
                <div className="navbar__user-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
                <span>{user?.name?.split(' ')[0]}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>▾</span>
              </button>
              {dropOpen && (
                <div className="navbar__dropdown" role="menu">
                  <div className="navbar__dropdown-header">
                    <div className="navbar__dropdown-name">{user?.name}</div>
                    <div className="navbar__dropdown-email">{user?.email}</div>
                  </div>
                  <Link to="/my-bookings" className="navbar__dropdown-item" onClick={() => setDropOpen(false)}>
                    📋 My Bookings
                  </Link>
                  <div className="navbar__dropdown-divider" />
                  <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}>Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}

          {/* Hamburger */}
          <button className="navbar__hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile${mobileOpen ? ' open' : ''}`}>
        <NavLink to="/" className="navbar__link" onClick={() => setMobileOpen(false)} end>Home</NavLink>
        <NavLink to="/search" className="navbar__link" onClick={() => setMobileOpen(false)}>Search Trains</NavLink>
        <NavLink to="/pnr" className="navbar__link" onClick={() => setMobileOpen(false)}>PNR Status</NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/my-bookings" className="navbar__link" onClick={() => setMobileOpen(false)}>My Bookings</NavLink>
            <button className="navbar__link" style={{ color: 'rgba(255,100,100,.8)', textAlign:'left' }} onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__link" onClick={() => setMobileOpen(false)}>Log In</Link>
            <Link to="/register" className="navbar__link" onClick={() => setMobileOpen(false)}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
