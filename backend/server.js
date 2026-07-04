require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes    = require('./routes/authRoutes');
const stationRoutes = require('./routes/stationRoutes');
const trainRoutes   = require('./routes/trainRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

connectDB();

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── CORS ───────────────────────────────────────────────────────────────────────
// Accepts:
//  • any localhost / 127.0.0.1 port (local dev)
//  • any *.vercel.app subdomain  (Vercel preview + production)
//  • any custom domain set via CLIENT_ORIGIN env var
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // curl / Postman / mobile
  if (process.env.NODE_ENV !== 'production') return true; // allow all in dev
  if (origin.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) return true;
  if (origin.match(/\.vercel\.app$/)) return true;
  if (origin.match(/\.onrender\.com$/)) return true;
  const custom = process.env.CLIENT_ORIGIN;
  if (custom && origin === custom) return true;
  return false;
};

app.use(cors({
  origin: (origin, cb) => isAllowedOrigin(origin) ? cb(null, true) : cb(new Error('CORS: origin not allowed — ' + origin)),
  credentials: true,
}));

// ── Rate limiter ───────────────────────────────────────────────────────────────
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests, please try again later.' },
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/trains',   trainRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/api/health', (_req, res) => res.json({
  success: true,
  message: 'RailKaro API is running',
  env: process.env.NODE_ENV,
  timestamp: new Date().toISOString(),
}));

// ── Error Handling ─────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n🚂  RailKaro API  →  http://localhost:' + PORT + '/api/health');
  console.log('    Environment  :  ' + (process.env.NODE_ENV || 'development') + '\n');
});
