require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Station = require('../models/Station');
const Train = require('../models/Train');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/railyatra';

const stations = [
  { code: 'NDLS', name: 'New Delhi', city: 'New Delhi', state: 'Delhi' },
  { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal' },
  { code: 'SBC', name: 'Bengaluru City', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat' },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan' },
  { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh' },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar' },
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh' },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh' },
  { code: 'INDB', name: 'Indore Junction', city: 'Indore', state: 'Madhya Pradesh' },
  { code: 'NZM', name: 'Hazrat Nizamuddin', city: 'New Delhi', state: 'Delhi' },
];

const trains = [
  {
    trainNumber: '12301',
    trainName: 'Rajdhani Express',
    source: { code: 'NDLS', name: 'New Delhi' },
    destination: { code: 'HWH', name: 'Howrah Junction' },
    departureTime: '16:55',
    arrivalTime: '09:55',
    duration: '17h 00m',
    distance: 1447,
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { type: 'SL', label: 'Sleeper', fare: 735, totalSeats: 500, availableSeats: 124 },
      { type: '3A', label: 'AC 3 Tier', fare: 1960, totalSeats: 200, availableSeats: 56 },
      { type: '2A', label: 'AC 2 Tier', fare: 2820, totalSeats: 100, availableSeats: 18 },
      { type: '1A', label: 'AC First Class', fare: 4785, totalSeats: 24, availableSeats: 4 },
    ],
    rating: 4.7,
  },
  {
    trainNumber: '12951',
    trainName: 'Mumbai Rajdhani',
    source: { code: 'NDLS', name: 'New Delhi' },
    destination: { code: 'BCT', name: 'Mumbai Central' },
    departureTime: '16:00',
    arrivalTime: '08:35',
    duration: '16h 35m',
    distance: 1384,
    runsOn: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { type: '3A', label: 'AC 3 Tier', fare: 2060, totalSeats: 200, availableSeats: 43 },
      { type: '2A', label: 'AC 2 Tier', fare: 2965, totalSeats: 100, availableSeats: 12 },
      { type: '1A', label: 'AC First Class', fare: 5020, totalSeats: 24, availableSeats: 6 },
    ],
    rating: 4.8,
  },
  {
    trainNumber: '12621',
    trainName: 'Tamil Nadu Express',
    source: { code: 'NDLS', name: 'New Delhi' },
    destination: { code: 'MAS', name: 'Chennai Central' },
    departureTime: '22:30',
    arrivalTime: '07:15',
    duration: '32h 45m',
    distance: 2175,
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { type: 'SL', label: 'Sleeper', fare: 1055, totalSeats: 500, availableSeats: 203 },
      { type: '3A', label: 'AC 3 Tier', fare: 2800, totalSeats: 200, availableSeats: 88 },
      { type: '2A', label: 'AC 2 Tier', fare: 4035, totalSeats: 100, availableSeats: 22 },
    ],
    rating: 4.5,
  },
  {
    trainNumber: '12627',
    trainName: 'Karnataka Express',
    source: { code: 'NDLS', name: 'New Delhi' },
    destination: { code: 'SBC', name: 'Bengaluru City' },
    departureTime: '21:20',
    arrivalTime: '05:45',
    duration: '32h 25m',
    distance: 2444,
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { type: 'SL', label: 'Sleeper', fare: 1180, totalSeats: 500, availableSeats: 312 },
      { type: '3A', label: 'AC 3 Tier', fare: 3140, totalSeats: 200, availableSeats: 97 },
      { type: '2A', label: 'AC 2 Tier', fare: 4520, totalSeats: 100, availableSeats: 34 },
      { type: '1A', label: 'AC First Class', fare: 7660, totalSeats: 24, availableSeats: 8 },
    ],
    rating: 4.4,
  },
  {
    trainNumber: '12723',
    trainName: 'AP Express',
    source: { code: 'NDLS', name: 'New Delhi' },
    destination: { code: 'HYB', name: 'Hyderabad Deccan' },
    departureTime: '07:00',
    arrivalTime: '06:00',
    duration: '23h 00m',
    distance: 1599,
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { type: 'SL', label: 'Sleeper', fare: 820, totalSeats: 500, availableSeats: 178 },
      { type: '3A', label: 'AC 3 Tier', fare: 2190, totalSeats: 200, availableSeats: 67 },
      { type: '2A', label: 'AC 2 Tier', fare: 3155, totalSeats: 100, availableSeats: 15 },
    ],
    rating: 4.3,
  },
  {
    trainNumber: '12009',
    trainName: 'Shatabdi Express',
    source: { code: 'NDLS', name: 'New Delhi' },
    destination: { code: 'AGC', name: 'Agra Cantt' },
    departureTime: '06:15',
    arrivalTime: '08:00',
    duration: '1h 45m',
    distance: 191,
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    classes: [
      { type: 'CC', label: 'Chair Car', fare: 750, totalSeats: 400, availableSeats: 156 },
    ],
    rating: 4.6,
  },
  {
    trainNumber: '12903',
    trainName: 'Golden Temple Mail',
    source: { code: 'BCT', name: 'Mumbai Central' },
    destination: { code: 'ADI', name: 'Ahmedabad Junction' },
    departureTime: '21:40',
    arrivalTime: '04:05',
    duration: '6h 25m',
    distance: 493,
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { type: 'SL', label: 'Sleeper', fare: 250, totalSeats: 500, availableSeats: 241 },
      { type: '3A', label: 'AC 3 Tier', fare: 680, totalSeats: 200, availableSeats: 89 },
      { type: '2A', label: 'AC 2 Tier', fare: 975, totalSeats: 100, availableSeats: 27 },
    ],
    rating: 4.2,
  },
  {
    trainNumber: '22691',
    trainName: 'Rajdhani Express',
    source: { code: 'SBC', name: 'Bengaluru City' },
    destination: { code: 'NDLS', name: 'New Delhi' },
    departureTime: '20:00',
    arrivalTime: '05:05',
    duration: '33h 05m',
    distance: 2444,
    runsOn: ['Tue', 'Wed', 'Thu', 'Sat', 'Sun'],
    classes: [
      { type: '3A', label: 'AC 3 Tier', fare: 3140, totalSeats: 200, availableSeats: 55 },
      { type: '2A', label: 'AC 2 Tier', fare: 4520, totalSeats: 100, availableSeats: 19 },
      { type: '1A', label: 'AC First Class', fare: 7660, totalSeats: 24, availableSeats: 3 },
    ],
    rating: 4.6,
  },
  {
    trainNumber: '12985',
    trainName: 'Jaipur Superfast',
    source: { code: 'NDLS', name: 'New Delhi' },
    destination: { code: 'JP', name: 'Jaipur Junction' },
    departureTime: '14:20',
    arrivalTime: '19:35',
    duration: '5h 15m',
    distance: 308,
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { type: 'SL', label: 'Sleeper', fare: 195, totalSeats: 500, availableSeats: 330 },
      { type: '3A', label: 'AC 3 Tier', fare: 520, totalSeats: 200, availableSeats: 142 },
      { type: 'CC', label: 'Chair Car', fare: 325, totalSeats: 300, availableSeats: 188 },
    ],
    rating: 4.1,
  },
  {
    trainNumber: '12004',
    trainName: 'Lucknow Shatabdi',
    source: { code: 'NDLS', name: 'New Delhi' },
    destination: { code: 'LKO', name: 'Lucknow Charbagh' },
    departureTime: '06:10',
    arrivalTime: '12:30',
    duration: '6h 20m',
    distance: 512,
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { type: 'CC', label: 'Chair Car', fare: 890, totalSeats: 400, availableSeats: 210 },
    ],
    rating: 4.5,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Station.deleteMany({});
    await Train.deleteMany({});

    await Station.insertMany(stations);
    console.log(`✅ Seeded ${stations.length} stations`);

    await Train.insertMany(trains);
    console.log(`✅ Seeded ${trains.length} trains`);

    console.log('\n🌱 Database seeding complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
}

seed();
