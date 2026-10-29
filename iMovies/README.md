# 🎬 IMovies - Full Stack Cinema Management & Ticket Booking System

A production-ready MERN stack web application that allows cinema patrons to browse movies, discover showtimes, reserve seats with **real-time availability tracking via Socket.io**, and complete ticket checkout with role-based JWT security.

---

## 🚀 Key Features

- **Real-Time Seat Availability**: WebSocket integration via Socket.io prevents double bookings and synchronizes seating updates across concurrent users.
- **Role-Based JWT Security**: Secure authentication for both regular cinema users and administrators. Passwords encrypted with `bcryptjs`.
- **Movie Catalog & Multi-Filter Search**: Search and filter by genre, language, theatre, city, and release schedule.
- **Seat Matrix & Tier Pricing**: Interactive auditorium layout featuring Standard, Premium, and VIP seat classifications with dynamic price tallying.
- **Booking Lifecycle**: Reservation holds, secure mock payment gateway checkout, cancellation with seat release, and e-ticket generation with QR placeholders.
- **Admin Management Console**: Key revenue analytics, movie catalog management, show scheduling across theatres, and system-wide booking audit logs.
- **Design System**: Built strictly using solid colors and light CSS (`#1a1a2e`, `#e94560`, `#ffffff`, `#f4f6fb`) for a clean, accessible interface.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js 18, Redux Toolkit, React Router DOM v6, Bootstrap 5, Socket.io-client, React-Toastify |
| **Backend** | Node.js, Express.js, Socket.io, Mongoose, JWT, bcryptjs, Morgan, Multer, Express-Rate-Limit |
| **Database** | MongoDB (Users, Movies, Theatres, Shows, Bookings, Payments, Notifications) |
| **Styling** | Solid Colors & Light CSS |

---

## 📁 Directory Structure

```
iMovies/
├── assets/                          # Generated graphics & cinema banner
│   └── cinema-banner.png
├── backend/                         # Express.js REST API & WebSocket Server
│   ├── config/                      # Database connection (Mongoose)
│   ├── controllers/                 # Business logic for Auth, Movies, Theatres, Shows, Bookings, Payments, Admin
│   ├── middleware/                  # JWT Protect, AdminOnly, RateLimiter, ErrorHandler, Multer Upload
│   ├── models/                      # User, Movie, Theatre, Show, Booking, Payment, Notification
│   ├── routes/                      # REST API endpoints
│   ├── seed.js                      # Database seeder (Pre-populates demo data)
│   ├── server.js                    # Server entry point with Socket.io
│   ├── .env                         # Environment variables
│   └── package.json
│
├── frontend/                        # React.js Single Page Application
│   ├── public/                      # index.html, assets, metadata
│   ├── src/
│   │   ├── components/              # Navbar, Footer, MovieCard, PrivateRoute, AdminRoute
│   │   ├── pages/                   # Home, MovieDetails, SeatSelection, Checkout, Confirmation, MyBookings, Login, Register
│   │   │   └── admin/               # AdminDashboard, AdminMovies, AdminShows, AdminBookings
│   │   ├── redux/                   # Redux Toolkit store & slices (authSlice, movieSlice, bookingSlice)
│   │   ├── services/                # Axios API instance & Socket.io client singleton
│   │   ├── App.js                   # Client routing configuration
│   │   ├── index.css                # Solid colors & light CSS styles
│   │   └── index.js
│   └── package.json
│
├── index.html                       # HTML Project Guide & Documentation Hub
├── css/                             # Documentation CSS
└── pages/                           # Interactive HTML documentation pages (Overview, Setup, DB, APIs, Security, Testing, etc.)
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js** (v16.0 or higher) & **npm**
- **MongoDB** running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI

### 2. Backend Setup
```bash
cd backend
npm install
node seed.js    # Pre-populates movies, theatres, showtimes & accounts!
npm run dev     # Starts backend on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start       # Starts React client on http://localhost:3000
```

---

## 🔑 Demo Login Credentials

The `seed.js` script automatically generates two pre-configured accounts:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@imovies.com` | `adminpassword123` | Full Admin Console, Inventory & Shows |
| **Cinema Patron** | `rahul@example.com` | `userpassword123` | Ticket reservations, Seat holds, Checkout |

*Tip: Quick-login buttons are also provided on the sign-in page for instant one-click testing.*

---

## 🔌 API Endpoints Summary

- **Authentication**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile`
- **Movies**: `GET /api/movies`, `GET /api/movies/:id`, `POST /api/movies` (Admin), `DELETE /api/movies/:id` (Admin)
- **Theatres**: `GET /api/theatres`, `POST /api/theatres` (Admin)
- **Shows**: `GET /api/shows`, `GET /api/shows/:id`, `GET /api/shows/:id/seats`, `POST /api/shows` (Admin)
- **Bookings**: `POST /api/bookings`, `GET /api/bookings/my`, `PUT /api/bookings/:id/cancel`
- **Payments**: `POST /api/payments/process`, `GET /api/payments/:id`
- **Admin**: `GET /api/admin/dashboard`, `GET /api/admin/bookings`, `GET /api/admin/users`