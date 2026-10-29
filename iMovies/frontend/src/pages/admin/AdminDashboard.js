import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-4">
      {/* Admin Nav Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h3 className="fw-bold text-dark mb-1">🛡️ Admin Management Console</h3>
          <p className="text-muted small mb-0">
            System overview, inventory metrics, and booking transaction logs
          </p>
        </div>

        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Link to="/admin/movies" className="btn btn-sm btn-outline-dark">
            Manage Movies
          </Link>
          <Link to="/admin/shows" className="btn btn-sm btn-outline-dark">
            Manage Shows
          </Link>
          <Link to="/admin/bookings" className="btn btn-sm btn-outline-dark">
            All Bookings
          </Link>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="mt-2 text-muted">Compiling analytics metrics...</p>
        </div>
      )}

      {stats && (
        <>
          {/* Metrics Counter Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="imovies-card shadow-sm p-3 border-start border-4 border-danger">
                <span className="text-muted small fw-bold text-uppercase">Total Revenue</span>
                <h3 className="fw-bold text-dark mt-1 mb-0">₹{stats.totalRevenue?.toLocaleString()}</h3>
                <span className="badge badge-solid badge-solid-success mt-2">Verified Completed</span>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="imovies-card shadow-sm p-3 border-start border-4 border-primary">
                <span className="text-muted small fw-bold text-uppercase">Total Bookings</span>
                <h3 className="fw-bold text-dark mt-1 mb-0">{stats.totalBookings}</h3>
                <span className="text-muted small mt-2 d-block">
                  Confirmed: <strong>{stats.confirmedBookings}</strong>
                </span>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="imovies-card shadow-sm p-3 border-start border-4 border-warning">
                <span className="text-muted small fw-bold text-uppercase">Active Movies</span>
                <h3 className="fw-bold text-dark mt-1 mb-0">{stats.totalMovies}</h3>
                <span className="text-muted small mt-2 d-block">In Circulation</span>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="imovies-card shadow-sm p-3 border-start border-4 border-success">
                <span className="text-muted small fw-bold text-uppercase">Partner Theatres</span>
                <h3 className="fw-bold text-dark mt-1 mb-0">{stats.totalTheatres}</h3>
                <span className="text-muted small mt-2 d-block">
                  Shows: <strong>{stats.totalShows}</strong> active
                </span>
              </div>
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="imovies-card shadow-sm">
            <h5 className="fw-bold text-dark mb-3">Recent Transactions</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Ref Code</th>
                    <th>Customer</th>
                    <th>Movie</th>
                    <th>Seats</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings?.map((b) => (
                    <tr key={b._id}>
                      <td className="font-monospace small fw-bold">{b.bookingCode}</td>
                      <td>
                        <div className="fw-bold small">{b.user?.name || 'Walk-in User'}</div>
                        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                          {b.user?.email}
                        </div>
                      </td>
                      <td className="small">{b.show?.movie?.title}</td>
                      <td>
                        <span className="badge badge-solid badge-solid-dark">
                          {b.seats?.join(', ')}
                        </span>
                      </td>
                      <td className="fw-bold small">₹{b.totalAmount}</td>
                      <td>
                        <span className="badge badge-solid badge-solid-success">
                          {b.status?.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

