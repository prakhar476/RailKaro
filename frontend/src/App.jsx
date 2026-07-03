import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ServerStatus from './components/ServerStatus';
import DisclaimerModal from './components/DisclaimerModal';

import HomePage       from './pages/HomePage';
import SearchPage     from './pages/SearchPage';
import BookingPage    from './pages/BookingPage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import PNRPage        from './pages/PNRPage';
import MyBookingsPage from './pages/MyBookingsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function Layout() {
  return (
    <>
      {/* Disclaimer shown once per session before anything else */}
      <DisclaimerModal />

      <ScrollToTop />
      <ServerStatus />
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/search"      element={<SearchPage />} />
          <Route path="/login"       element={<LoginPage />} />
          <Route path="/register"    element={<RegisterPage />} />
          <Route path="/pnr"         element={<PNRPage />} />
          <Route path="/book"        element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
          <Route path="*" element={
            <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="empty-state">
                <div className="empty-state__icon">🚧</div>
                <h2 className="empty-state__title">404 — Page Not Found</h2>
                <p className="empty-state__desc">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary" style={{ marginTop: 'var(--sp-5)' }}>Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.9rem',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(15,15,26,.18)',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' }, duration: 6000 },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
