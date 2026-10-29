import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShow, setNewShow] = useState({
    movie: '',
    theatre: '',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '07:00 PM',
    standardPrice: 200,
    premiumPrice: 350,
    vipPrice: 500,
    screenNumber: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [showsRes, moviesRes, theatresRes] = await Promise.all([
        api.get('/shows'),
        api.get('/movies?limit=50'),
        api.get('/theatres'),
      ]);
      setShows(showsRes.data.data || []);
      setMovies(moviesRes.data.data || []);
      setTheatres(theatresRes.data.data || []);
      if (moviesRes.data.data?.length > 0 && !newShow.movie) {
        setNewShow((prev) => ({ ...prev, movie: moviesRes.data.data[0]._id }));
      }
      if (theatresRes.data.data?.length > 0 && !newShow.theatre) {
        setNewShow((prev) => ({ ...prev, theatre: theatresRes.data.data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddShow = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/shows', {
        movie: newShow.movie,
        theatre: newShow.theatre,
        showDate: newShow.showDate,
        showTime: newShow.showTime,
        ticketPrice: {
          standard: Number(newShow.standardPrice),
          premium: Number(newShow.premiumPrice),
          vip: Number(newShow.vipPrice),
        },
        screenNumber: Number(newShow.screenNumber),
      });
      setShowAddForm(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule show');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelShow = async (id) => {
    if (window.confirm('Cancel this show schedule?')) {
      try {
        await api.delete(`/shows/${id}`);
        loadData();
      } catch (err) {
        alert('Failed to cancel show');
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h3 className="fw-bold text-dark mb-1">📅 Showtimes & Auditoriums</h3>
          <p className="text-muted small mb-0">Schedule film screenings across theatre complexes</p>
        </div>

        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Link to="/admin/dashboard" className="btn btn-sm btn-outline-secondary">
            ← Dashboard
          </Link>
          <button
            className="btn btn-sm btn-imovies-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '✕ Close Form' : '+ Schedule New Show'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="imovies-card shadow-sm mb-4">
          <h5 className="fw-bold text-dark mb-3">Schedule Show</h5>
          <form onSubmit={handleAddShow}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Select Movie</label>
                <select
                  className="form-select"
                  value={newShow.movie}
                  onChange={(e) => setNewShow({ ...newShow, movie: e.target.value })}
                  required
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title} ({m.language})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Select Theatre</label>
                <select
                  className="form-select"
                  value={newShow.theatre}
                  onChange={(e) => setNewShow({ ...newShow, theatre: e.target.value })}
                  required
                >
                  {theatres.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-bold">Show Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={newShow.showDate}
                  onChange={(e) => setNewShow({ ...newShow, showDate: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-bold">Show Time</label>
                <input
                  type="text"
                  placeholder="e.g. 06:45 PM"
                  className="form-control"
                  value={newShow.showTime}
                  onChange={(e) => setNewShow({ ...newShow, showTime: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-bold">Standard (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newShow.standardPrice}
                  onChange={(e) =>
                    setNewShow({ ...newShow, standardPrice: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-bold">Premium (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newShow.premiumPrice}
                  onChange={(e) =>
                    setNewShow({ ...newShow, premiumPrice: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-bold">Screen #</label>
                <input
                  type="number"
                  className="form-control"
                  value={newShow.screenNumber}
                  onChange={(e) =>
                    setNewShow({ ...newShow, screenNumber: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-imovies-primary mt-3 px-4"
              disabled={submitting}
            >
              {submitting ? 'Scheduling...' : 'Save & Publish Show'}
            </button>
          </form>
        </div>
      )}

      {/* Shows Listing Table */}
      <div className="imovies-card shadow-sm">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-danger spinner-border-sm"></div>
            <span className="ms-2 text-muted small">Loading shows...</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Movie</th>
                  <th>Theatre</th>
                  <th>Date & Time</th>
                  <th>Prices</th>
                  <th>Booked</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((s) => (
                  <tr key={s._id}>
                    <td className="fw-bold">{s.movie?.title}</td>
                    <td className="small">
                      {s.theatre?.name} ({s.theatre?.city})
                    </td>
                    <td className="small">
                      {new Date(s.showDate).toLocaleDateString()} at{' '}
                      <strong>{s.showTime}</strong> (Screen {s.screenNumber})
                    </td>
                    <td className="small">
                      ₹{s.ticketPrice?.standard} / ₹{s.ticketPrice?.premium}
                    </td>
                    <td>
                      <span className="badge badge-solid badge-solid-dark">
                        {s.bookedSeats?.length || 0} / {s.totalSeats || 60}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-solid ${
                          s.status === 'active'
                            ? 'badge-solid-success'
                            : 'badge-solid-dark'
                        }`}
                      >
                        {s.status?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {s.status === 'active' && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleCancelShow(s._id)}
                        >
                          Cancel
                        </button>
                      )}
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

export default AdminShows;

