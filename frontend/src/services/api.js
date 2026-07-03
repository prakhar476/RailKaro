import axios from 'axios';

/**
 * Base URL resolution order:
 *  1. VITE_API_URL environment variable (set in frontend/.env)
 *  2. Vite dev-server proxy  →  /api  (works with `npm run dev`)
 *  3. Falls back to direct localhost:5000 so the app works even
 *     without the proxy (e.g. after `npm run build && npm run preview`)
 */
const BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api' : 'http://localhost:5000/api');

// ── Axios instance ─────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT automatically on every request
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('railyatra_user') || '{}');
    if (user.token) config.headers.Authorization = 'Bearer ' + user.token;
  } catch {}
  return config;
});

// Unified error interceptor — turn every failure into a readable message
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      // Network error — backend not reachable
      error.userMessage =
        'Cannot reach the server. Please make sure the backend is running on port 5000 and MongoDB is connected.';
    } else {
      error.userMessage =
        error.response?.data?.message ||
        'Something went wrong (status ' + error.response.status + ')';
    }
    return Promise.reject(error);
  }
);

// ── Auth ───────────────────────────────────────────────────────────────────────
export const register = (data) => api.post('/auth/register', data).then((r) => r.data);
export const login    = (data) => api.post('/auth/login',    data).then((r) => r.data);
export const getProfile = ()  => api.get('/auth/profile').then((r) => r.data);

// ── Stations ───────────────────────────────────────────────────────────────────
export const getStations = () => api.get('/stations').then((r) => r.data);

// ── Trains ─────────────────────────────────────────────────────────────────────
export const searchTrains = (from, to) =>
  api.get('/trains/search', { params: { from, to } }).then((r) => r.data);

export const getTrainById = (id) => api.get('/trains/' + id).then((r) => r.data);

// ── Bookings ───────────────────────────────────────────────────────────────────
export const createBooking  = (data) => api.post('/bookings', data).then((r) => r.data);
export const payForBooking  = (id)   => api.put('/bookings/' + id + '/pay', {}).then((r) => r.data);
export const getMyBookings  = ()     => api.get('/bookings/my').then((r) => r.data);
export const getBookingByPNR = (pnr) => api.get('/bookings/pnr/' + pnr).then((r) => r.data);
export const cancelBooking  = (id)   => api.put('/bookings/' + id + '/cancel', {}).then((r) => r.data);

// ── Health check ───────────────────────────────────────────────────────────────
export const checkHealth = () => api.get('/health').then((r) => r.data);
