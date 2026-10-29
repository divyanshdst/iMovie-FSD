import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const loadBookings = () => {
    setLoading(true);
    const query = statusFilter ? `?status=${statusFilter}` : '';
    api
      .get(`/admin/bookings${query}`)
      .then((res) => setBookings(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h3 className="fw-bold text-dark mb-1">🎟️ System Bookings Audit</h3>
          <p className="text-muted small mb-0">Platform-wide reservation audit trail and ticket lifecycle</p>
        </div>

        <div className="d-flex gap-2 align-items-center mt-3 mt-md-0">
          <Link to="/admin/dashboard" className="btn btn-sm btn-outline-secondary">
            ← Dashboard
          </Link>
          <select
            className="form-select form-select-sm"
            style={{ width: '160px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="imovies-card shadow-sm">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-danger spinner-border-sm"></div>
            <span className="ms-2 text-muted small">Auditing bookings...</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Movie</th>
                  <th>Auditorium</th>
                  <th>Seats</th>
                  <th>Total Fare</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="font-monospace small fw-bold">{b.bookingCode}</td>
                    <td>
                      <div className="fw-bold small">{b.user?.name || 'Walk-in'}</div>
                      <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                        {b.user?.email}
                      </div>
                    </td>
                    <td className="small fw-bold">{b.show?.movie?.title}</td>
                    <td className="small">
                      {b.show?.theatre?.name} ({b.show?.theatre?.city})
                    </td>
                    <td>
                      <span className="badge badge-solid badge-solid-dark">
                        {b.seats?.join(', ')}
                      </span>
                    </td>
                    <td className="fw-bold small">₹{b.totalAmount}</td>
                    <td>
                      <span
                        className={`badge badge-solid ${
                          b.status === 'confirmed'
                            ? 'badge-solid-success'
                            : b.status === 'pending'
                            ? 'badge-solid-warning'
                            : 'badge-solid-dark'
                        }`}
                      >
                        {b.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="small text-muted">
                      {new Date(b.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;

