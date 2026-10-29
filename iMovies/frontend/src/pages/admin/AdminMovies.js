import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    genre: '',
    language: 'English',
    duration: 130,
    rating: 8.0,
    releaseDate: '2025-01-01',
    poster: '',
    director: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadMovies = () => {
    setLoading(true);
    api
      .get('/movies?limit=50')
      .then((res) => setMovies(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/movies', newMovie);
      setShowAddForm(false);
      setNewMovie({
        title: '',
        description: '',
        genre: '',
        language: 'English',
        duration: 130,
        rating: 8.0,
        releaseDate: '2025-01-01',
        poster: '',
        director: '',
      });
      loadMovies();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add movie');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this movie from listing?')) {
      try {
        await api.delete(`/movies/${id}`);
        loadMovies();
      } catch (err) {
        alert('Failed to delete movie');
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h3 className="fw-bold text-dark mb-1">🎬 Movies Inventory</h3>
          <p className="text-muted small mb-0">Create, edit, and deactivate theatrical features</p>
        </div>

        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Link to="/admin/dashboard" className="btn btn-sm btn-outline-secondary">
            ← Dashboard
          </Link>
          <button
            className="btn btn-sm btn-imovies-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '✕ Close Form' : '+ Add New Movie'}
          </button>
        </div>
      </div>

      {/* Add Movie Form */}
      {showAddForm && (
        <div className="imovies-card shadow-sm mb-4">
          <h5 className="fw-bold text-dark mb-3">Add New Movie</h5>
          <form onSubmit={handleAddMovie}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Title</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Language</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={newMovie.language}
                  onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Duration (Minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  value={newMovie.duration}
                  onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Genres (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Action, Sci-Fi, Adventure"
                  className="form-control"
                  required
                  value={newMovie.genre}
                  onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Director</label>
                <input
                  type="text"
                  className="form-control"
                  value={newMovie.director}
                  onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Release Date</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={newMovie.releaseDate}
                  onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-bold">Poster Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="form-control"
                  value={newMovie.poster}
                  onChange={(e) => setNewMovie({ ...newMovie, poster: e.target.value })}
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-bold">Synopsis / Storyline</label>
                <textarea
                  className="form-control"
                  rows="3"
                  required
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                ></textarea>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-imovies-primary mt-3 px-4"
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Save & Publish Movie'}
            </button>
          </form>
        </div>
      )}

      {/* Movies Table */}
      <div className="imovies-card shadow-sm">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-danger spinner-border-sm"></div>
            <span className="ms-2 text-muted small">Loading movies...</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Language</th>
                  <th>Duration</th>
                  <th>Release</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m._id}>
                    <td>
                      <img
                        src={
                          m.poster ||
                          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'
                        }
                        alt={m.title}
                        className="rounded"
                        style={{ width: '45px', height: '60px', objectFit: 'cover' }}
                      />
                    </td>
                    <td className="fw-bold">{m.title}</td>
                    <td>
                      <span className="small">{m.genre?.join(', ')}</span>
                    </td>
                    <td>{m.language}</td>
                    <td>{m.duration}m</td>
                    <td className="small">
                      {new Date(m.releaseDate).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(m._id)}
                      >
                        Delete
                      </button>
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

export default AdminMovies;

