const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Movie = require('./models/Movie');
const Theatre = require('./models/Theatre');
const Show = require('./models/Show');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imoviesdb');
    console.log('MongoDB Connected.');

    console.log('Clearing old sample records...');
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Theatre.deleteMany({}),
      Show.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
    ]);

    // 1. Create Users
    console.log('Seeding Users...');
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@imovies.com',
      password: 'adminpassword123',
      role: 'admin',
      phone: '+91 9876543210',
    });

    const demoUser = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'userpassword123',
      role: 'user',
      phone: '+91 9811223344',
    });

    // 2. Create Movies
    console.log('Seeding Movies...');
    const movies = await Movie.create([
      {
        title: 'Interstellar: Beyond Time',
        description:
          'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
        genre: ['Sci-Fi', 'Adventure', 'Drama'],
        language: 'English',
        duration: 169,
        rating: 8.9,
        releaseDate: new Date('2024-11-05'),
        poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
        director: 'Christopher Nolan',
        cast: [
          { name: 'Matthew McConaughey', role: 'Cooper' },
          { name: 'Anne Hathaway', role: 'Brand' },
        ],
      },
      {
        title: 'Cyberpunk Neon Genesis',
        description:
          'In a dystopian sprawling megalopolis of 2088, an augmented detective uncovers a covert artificial intelligence syndicate manipulating human memories and election results.',
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        language: 'English',
        duration: 142,
        rating: 8.5,
        releaseDate: new Date('2025-01-15'),
        poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
        director: 'Dennis Villeneuve',
        cast: [
          { name: 'Ryan Gosling', role: 'Detective K' },
          { name: 'Ana de Armas', role: 'Joi' },
        ],
      },
      {
        title: 'The Silent Horizon',
        description:
          'A gripping submarine mystery thriller set in deep sub-antarctic waters where a crew must avert global catastrophic escalation.',
        genre: ['Thriller', 'Drama', 'Mystery'],
        language: 'Hindi',
        duration: 135,
        rating: 8.2,
        releaseDate: new Date('2024-12-20'),
        poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        director: 'Kabir Khan',
        cast: [
          { name: 'Ranbir Kapoor', role: 'Commander Vikram' },
          { name: 'Deepika Padukone', role: 'Officer Neha' },
        ],
      },
      {
        title: 'Guardians of the Wild',
        description:
          'An awe-inspiring wildlife documentary saga following majestic big cats across the heart of African and Asian grasslands.',
        genre: ['Documentary', 'Adventure'],
        language: 'English',
        duration: 110,
        rating: 9.1,
        releaseDate: new Date('2024-10-10'),
        poster: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=800&auto=format&fit=crop&q=80',
        director: 'David Attenborough',
        cast: [{ name: 'David Attenborough', role: 'Narrator' }],
      },
      {
        title: 'Echoes of the Past',
        description:
          'A heart-warming period drama exploring the romantic memoirs of two musicians across 1960s Paris and Rome.',
        genre: ['Romance', 'Drama', 'Music'],
        language: 'French',
        duration: 125,
        rating: 7.9,
        releaseDate: new Date('2025-02-14'),
        poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
        director: 'Damien Chazelle',
        cast: [
          { name: 'Timothée Chalamet', role: 'Julian' },
          { name: 'Emma Stone', role: 'Claire' },
        ],
      },
      {
        title: 'Supernova Legacy',
        description:
          'Earth’s defenders assemble for one final confrontation as an ancient cosmic entity approaches solar orbit.',
        genre: ['Action', 'Fantasy'],
        language: 'English',
        duration: 155,
        rating: 8.4,
        releaseDate: new Date('2025-03-01'),
        poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
        director: 'James Gunn',
        cast: [
          { name: 'Chris Pratt', role: 'Star Captain' },
          { name: 'Zoe Saldana', role: 'Gamora' },
        ],
      },
    ]);

    // 3. Create Theatres
    console.log('Seeding Theatres...');
    const theatres = await Theatre.create([
      {
        name: 'PVR IMAX Phoenix Marketcity',
        address: 'Whitefield Main Road, Mahadevapura',
        city: 'Bengaluru',
        state: 'Karnataka',
        screens: 4,
        totalSeats: 60,
        amenities: ['IMAX with Laser', 'Dolby Atmos', 'Recliner Seats', 'Gourmet Cafeteria'],
      },
      {
        name: 'INOX Megaplex Mall of India',
        address: 'Sector 18, Commercial Belt',
        city: 'Delhi NCR',
        state: 'Delhi',
        screens: 6,
        totalSeats: 60,
        amenities: ['4DX Motion', 'Dolby 7.1', 'Valet Parking', 'Wheelchair Access'],
      },
      {
        name: 'Cinépolis Grand Waterfront',
        address: 'Marine Lines West, Nariman Point',
        city: 'Mumbai',
        state: 'Maharashtra',
        screens: 5,
        totalSeats: 60,
        amenities: ['VIP Lounge', 'Dolby Atmos', 'Reserved Dining', 'Laser Projection'],
      },
    ]);

    // 4. Create Shows
    console.log('Seeding Shows...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const shows = await Show.create([
      {
        movie: movies[0]._id,
        theatre: theatres[0]._id,
        showDate: today,
        showTime: '10:30 AM',
        ticketPrice: { standard: 220, premium: 350, vip: 500 },
        totalSeats: 60,
        bookedSeats: ['A3', 'A4', 'B5', 'C2'],
        screenNumber: 1,
      },
      {
        movie: movies[0]._id,
        theatre: theatres[0]._id,
        showDate: today,
        showTime: '06:45 PM',
        ticketPrice: { standard: 250, premium: 400, vip: 550 },
        totalSeats: 60,
        bookedSeats: ['D1', 'D2', 'D3'],
        screenNumber: 1,
      },
      {
        movie: movies[1]._id,
        theatre: theatres[1]._id,
        showDate: today,
        showTime: '02:15 PM',
        ticketPrice: { standard: 200, premium: 320, vip: 450 },
        totalSeats: 60,
        bookedSeats: ['C4', 'C5'],
        screenNumber: 2,
      },
      {
        movie: movies[2]._id,
        theatre: theatres[2]._id,
        showDate: tomorrow,
        showTime: '07:30 PM',
        ticketPrice: { standard: 240, premium: 380, vip: 500 },
        totalSeats: 60,
        bookedSeats: ['E1', 'E2'],
        screenNumber: 3,
      },
      {
        movie: movies[3]._id,
        theatre: theatres[0]._id,
        showDate: tomorrow,
        showTime: '04:00 PM',
        ticketPrice: { standard: 180, premium: 280, vip: 400 },
        totalSeats: 60,
        bookedSeats: [],
        screenNumber: 2,
      },
    ]);

    // 5. Create Sample Booking
    console.log('Seeding Sample Booking & Payment...');
    const booking = await Booking.create({
      user: demoUser._id,
      show: shows[0]._id,
      seats: ['A3', 'A4'],
      seatType: 'standard',
      totalAmount: 440,
      status: 'confirmed',
    });

    await Payment.create({
      booking: booking._id,
      user: demoUser._id,
      amount: 440,
      paymentMethod: 'upi',
      status: 'completed',
    });

    console.log('========================================================');
    console.log('✅ IMovies Database Seeded Successfully!');
    console.log('--------------------------------------------------------');
    console.log('🔑 Admin Credentials:');
    console.log('   Email:    admin@imovies.com');
    console.log('   Password: adminpassword123');
    console.log('--------------------------------------------------------');
    console.log('👤 Demo User Credentials:');
    console.log('   Email:    rahul@example.com');
    console.log('   Password: userpassword123');
    console.log('========================================================');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();

