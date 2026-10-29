import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyBookings, cancelUserBooking } from '../redux/slices/bookingSlice';

const MyBookings = () => {
  const dispatch = useDispatch();
  const { bookingsList: bookings, loading } = useSelector((state) => state.bookings);
  const [filterStatus, setFilterStatus] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    dispatch(fetchMyBookings(filterStatus));
  }, [dispatch, filterStatus]);

  const handleCancel = async (bookingId) => {
    if (
      window.confirm(
        'Are you sure you want to cancel this ticket reservation? Your seats will be released.'
      )
    ) {
      setCancellingId(bookingId);
      await dispatch(
        cancelUserBooking({
          bookingId,
          reason: 'Customer requested cancellation via portal',
        })
      );
      setCancellingId(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">My Booking History</h3>
          <p className="text-muted small mb-0">
            Track your upcoming showtimes, e-tickets, and transaction receipts
          </p>
        </div>

        {/* Status Filter Pills */}
        <div className="btn-group mt-3 mt-md-0" role="group">
          <button
            type="button"
            className={`btn btn-sm ${
              filterStatus === '' ? 'btn-imovies-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => setFilterStatus('')}
          >
            All Bookings
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              filterStatus === 'confirmed' ? 'btn-imovies-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => setFilterStatus('confirmed')}
          >
            Confirmed
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              filterStatus === 'cancelled' ? 'btn-imovies-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => setFilterStatus('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="mt-2 text-muted">Retrieving your ticket reservations...</p>
        </div>
      )}

      {!loading && bookings?.length === 0 && (
        <div className="imovies-card text-center py-5">
          <h5 className="fw-bold text-dark mb-2">No bookings found</h5>
          <p className="text-muted small mb-3">
            You don't have any reservations matching this status filter.
          </p>
          <Link to="/" className="btn btn-imovies-primary btn-sm">
            Discover Movies Now
          </Link>
        </div>
      )}

      <div className="row g-3">
        {!loading &&
          bookings?.map((b) => {
            const show = b.show;
            const movie = show?.movie;
            const theatre = show?.theatre;
            const isConfirmed = b.status === 'confirmed';

            return (
              <div key={b._id} className="col-12">
                <div className="imovies-card shadow-sm p-3">
                  <div className="row g-3 align-items-center">
                    <div className="col-md-2 text-center">
                      <img
                        src={
                          movie?.poster?.startsWith('http')
                            ? movie.poster
                            : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'
                        }
                        alt={movie?.title}
                        className="rounded"
                        style={{ width: '80px', height: '110px', objectFit: 'cover' }}
                      />
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="font-monospace small text-muted">
                          #{b.bookingCode}
                        </span>
                        <span
                          className={`badge badge-solid ${
                            isConfirmed
                              ? 'badge-solid-success'
                              : b.status === 'pending'
                              ? 'badge-solid-warning'
                              : 'badge-solid-dark'
                          }`}
                        >
                          {b.status?.toUpperCase()}
                        </span>
                      </div>

                      <h5 className="fw-bold text-dark mb-1">{movie?.title}</h5>
                      <p className="text-secondary small mb-1">
                        🏛️ <strong>{theatre?.name}</strong>, {theatre?.city}
                      </p>
                      <p className="text-secondary small mb-1">
                        🗓️ {new Date(show?.showDate).toLocaleDateString()} at{' '}
                        <strong>{show?.showTime}</strong>
                      </p>
                      <p className="text-secondary small mb-0">
                        💺 Seats:{' '}
                        <span className="badge badge-solid badge-solid-accent">
                          {b.seats?.join(', ')}
                        </span>
                      </p>
                    </div>

                    <div className="col-md-4 text-md-end border-start-md ps-md-3">
                      <div className="mb-2">
                        <span className="text-muted small d-block">Total Paid</span>
                        <span className="fs-5 fw-bold text-dark">₹{b.totalAmount}</span>
                      </div>

                      <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                        {isConfirmed && (
                          <Link
                            to={`/confirmation/${b._id}`}
                            className="btn btn-sm btn-outline-dark"
                          >
                            View Ticket 🎟️
                          </Link>
                        )}

                        {b.status === 'pending' && (
                          <Link
                            to={`/checkout/${b._id}`}
                            className="btn btn-sm btn-imovies-primary"
                          >
                            Pay Now 💳
                          </Link>
                        )}

                        {isConfirmed && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleCancel(b._id)}
                            disabled={cancellingId === b._id}
                          >
                            {cancellingId === b._id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MyBookings;

