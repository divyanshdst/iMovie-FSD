import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-md-5">
            <h5 className="text-white fw-bold mb-3">🎬 iMovies</h5>
            <p className="text-secondary small mb-0">
              A robust online cinema management and ticketing platform offering
              real-time seat availability, instant reservations, and multi-theatre showtimes.
              Built on the high-performance MERN stack with WebSocket concurrency.
            </p>
          </div>
          <div className="col-md-3">
            <h6 className="text-white fw-bold mb-3">Quick Navigation</h6>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-1"><a href="/" className="text-secondary">Now Showing</a></li>
              <li className="mb-1"><a href="/my-bookings" className="text-secondary">Booking History</a></li>
              <li className="mb-1"><a href="/login" className="text-secondary">User Account</a></li>
              <li className="mb-1"><a href="/admin/dashboard" className="text-secondary">Admin Management</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="text-white fw-bold mb-3">Cinema Experience</h6>
            <p className="text-secondary small mb-1">
              Supports IMAX with Laser, Dolby Atmos 7.1, 4DX Motion, and VIP luxury recliners across premier metropolitan theatres.
            </p>
            <span className="badge badge-solid badge-solid-accent mt-2">v1.0.0 MERN Production Ready</span>
          </div>
        </div>
        <hr className="border-secondary my-3" />
        <div className="d-flex flex-wrap justify-content-between align-items-center small text-secondary">
          <span>&copy; {new Date().getFullYear()} IMovies Entertainment Systems. All Rights Reserved.</span>
          <span>Solid Colors & Light CSS Implementation</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

