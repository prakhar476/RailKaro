import axios from 'axios';

/**
 * API Base URL resolution:
 *  1. VITE_API_URL  — set this in Vercel dashboard for production
 *     e.g.  https://railKaro-backend.onrender.com/api
 *  2. /api          — Vite dev-server proxy (local development)
 */
const BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach JWT token on every request
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('railKaro_user') || '{}');
    if (user.token) config.headers.Authorization = 'Bearer ' + user.token;
  } catch {}
  return config;
});

// Convert every error into a readable human message
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      error.userMessage =
        'Cannot reach the server. Make sure the backend is running and VITE_API_URL is set correctly.';
    } else {
      error.userMessage =
        error.response?.data?.message ||
        'Something went wrong (HTTP ' + error.response.status + ')';
    }
    return Promise.reject(error);
  }
);

// ── Auth ───────────────────────────────────────────────────────────────────────
export const register    = (data) => api.post('/auth/register', data).then((r) => r.data);
export const login       = (data) => api.post('/auth/login',    data).then((r) => r.data);
export const getProfile  = ()     => api.get('/auth/profile').then((r) => r.data);

// ── Stations ───────────────────────────────────────────────────────────────────
export const getStations = () => api.get('/stations').then((r) => r.data);

// ── Trains ─────────────────────────────────────────────────────────────────────
export const searchTrains  = (from, to) => api.get('/trains/search', { params: { from, to } }).then((r) => r.data);
export const getTrainById  = (id)       => api.get('/trains/' + id).then((r) => r.data);

// ── Bookings ───────────────────────────────────────────────────────────────────
export const createBooking   = (data) => api.post('/bookings',                   data).then((r) => r.data);
export const payForBooking   = (id)   => api.put('/bookings/' + id + '/pay',   {}).then((r) => r.data);
export const getMyBookings   = ()     => api.get('/bookings/my').then((r) => r.data);
export const getBookingByPNR = (pnr)  => api.get('/bookings/pnr/' + pnr).then((r) => r.data);
export const cancelBooking   = (id)   => api.put('/bookings/' + id + '/cancel', {}).then((r) => r.data);

// ── Health ─────────────────────────────────────────────────────────────────────
export const checkHealth = () => api.get('/health').then((r) => r.data);
