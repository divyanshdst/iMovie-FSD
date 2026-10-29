import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const Confirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/bookings/${bookingId}`)
      .then((res) => {
        setBooking(res.data.data);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [bookingId]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="mt-2 text-muted">Retrieving electronic ticket...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">Ticket reference not found.</div>
        <Link to="/" className="btn btn-imovies-primary">
          Return to Home
        </Link>
      </div>
    );
  }

  const show = booking.show;
  const movie = show?.movie;
  const theatre = show?.theatre;

  return (
    <div className="container py-5">
      <div className="ticket-container shadow-sm">
        <div className="text-center mb-4">
          <span className="badge badge-solid badge-solid-success mb-2">
            ✓ Booking & Payment Confirmed
          </span>
          <h3 className="fw-bold text-dark mb-0">E-Ticket Confirmation</h3>
          <p className="text-muted small">Show this digital pass at the cinema turnstile</p>
        </div>

        <div className="border-top border-bottom py-3 mb-3">
          <div className="row g-3">
            <div className="col-sm-6">
              <span className="text-muted small d-block">Booking Reference:</span>
              <span className="fw-bold fs-5 text-dark font-monospace">
                {booking.bookingCode}
              </span>
            </div>
            <div className="col-sm-6 text-sm-end">
              <span className="text-muted small d-block">Status:</span>
              <span className="badge badge-solid badge-solid-success">
                CONFIRMED & PAID
              </span>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-sm-8">
            <h4 className="fw-bold text-dark mb-1">{movie?.title}</h4>
            <p className="text-muted small mb-2">
              {movie?.language} &nbsp;|&nbsp; {movie?.genre?.join(', ')}
            </p>

            <div className="small text-secondary mb-1">
              🏛️ <strong>{theatre?.name}</strong>, {theatre?.city}
            </div>
            <div className="small text-secondary mb-1">
              🗓️ <strong>{new Date(show?.showDate).toLocaleDateString()}</strong> at{' '}
              <strong>{show?.showTime}</strong>
            </div>
            <div className="small text-secondary">
              📺 Screen <strong>{show?.screenNumber || 1}</strong> &nbsp;|&nbsp; Class:{' '}
              <strong>{booking.seatType?.toUpperCase()}</strong>
            </div>
          </div>

          <div className="col-sm-4 text-center d-flex flex-column align-items-center justify-content-center bg-light rounded p-3">
            <div
              style={{
                width: 90,
                height: 90,
                backgroundColor: '#1a1a2e',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              [QR SCAN]
            </div>
            <span className="small text-muted mt-2" style={{ fontSize: '0.7rem' }}>
              Scan at Entrance
            </span>
          </div>
        </div>

        <div className="bg-light p-3 rounded mb-4">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-bold">Seats Reserved:</span>
            <span className="badge badge-solid badge-solid-accent fs-6">
              {booking.seats?.join(', ')}
            </span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted small">Total Paid:</span>
            <span className="fw-bold text-dark">₹{booking.totalAmount}</span>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 justify-content-center">
          <button
            onClick={() => window.print()}
            className="btn btn-outline-dark btn-sm fw-bold px-3"
          >
            🖨️ Print Ticket
          </button>
          <Link to="/my-bookings" className="btn btn-imovies-secondary btn-sm px-3">
            View in My Bookings
          </Link>
          <Link to="/" className="btn btn-imovies-primary btn-sm px-3">
            Explore More Movies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

