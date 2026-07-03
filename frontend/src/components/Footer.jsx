import { Link } from 'react-router-dom';
import '../styles/auth.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand-logo">Rail<span>Yatra</span></div>
            <p className="footer__brand-desc">
              India's trusted online train ticketing platform. Book, manage, and track your journeys with ease.
            </p>
          </div>
          <div>
            <div className="footer__col-title">Quick Links</div>
            <Link to="/" className="footer__link">Home</Link>
            <Link to="/search" className="footer__link">Search Trains</Link>
            <Link to="/pnr" className="footer__link">PNR Status</Link>
            <Link to="/my-bookings" className="footer__link">My Bookings</Link>
          </div>
          <div>
            <div className="footer__col-title">Services</div>
            <span className="footer__link">Tatkal Booking</span>
            <span className="footer__link">Group Booking</span>
            <span className="footer__link">Tourist Pass</span>
            <span className="footer__link">Season Pass</span>
          </div>
          <div>
            <div className="footer__col-title">Support</div>
            <span className="footer__link">Help Centre</span>
            <span className="footer__link">Cancellation Policy</span>
            <span className="footer__link">Refund Status</span>
            <span className="footer__link">Contact Us</span>
          </div>
        </div>
        <div className="footer__bottom">
          <span className="footer__copy">© {new Date().getFullYear()} RailYatra. Built for demonstration.</span>
          <span className="footer__copy">🚂 Powered by Node.js · React · MongoDB</span>
        </div>
      </div>
    </footer>
  );
}
