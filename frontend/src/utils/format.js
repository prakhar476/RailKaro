import { format, parseISO } from 'date-fns';

export const formatDate = (dateStr) => {
  try { return format(parseISO(dateStr), 'dd MMM yyyy'); } catch { return dateStr; }
};

export const formatDateFull = (dateStr) => {
  try { return format(parseISO(dateStr), 'EEEE, dd MMMM yyyy'); } catch { return dateStr; }
};

export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const statusColor = (status) => {
  const map = { confirmed: 'green', waitlisted: 'orange', cancelled: 'red', paid: 'green', pending: 'orange', failed: 'red' };
  return map[status] || 'blue';
};

export const classLabels = {
  SL: 'Sleeper (SL)',
  '3A': 'AC 3 Tier (3A)',
  '2A': 'AC 2 Tier (2A)',
  '1A': 'First Class AC (1A)',
  CC: 'Chair Car (CC)',
};
