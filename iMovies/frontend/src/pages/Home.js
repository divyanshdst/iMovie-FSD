import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../redux/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import api from '../services/api';

const Home = () => {
  const dispatch = useDispatch();
  const { movies, loading, error } = useSelector((state) => state.movies);

  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    // Fetch filter metadata
    api.get('/movies/meta/genres').then((res) => setGenres(res.data.data || [])).catch(() => {});
    api.get('/movies/meta/languages').then((res) => setLanguages(res.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    dispatch(
      fetchMovies({
        search,
        genre: selectedGenre,
        language: selectedLanguage,
      })
    );
  }, [dispatch, search, selectedGenre, selectedLanguage]);

  return (
    <div>
      {/* Hero Banner Section */}
      <div
        style={{
          backgroundColor: '#1a1a2e',
          color: '#ffffff',
          padding: '48px 0',
          borderBottom: '3px solid #e94560',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="badge badge-solid badge-solid-accent mb-2">
                Real-Time Cinema Ticketing
              </span>
              <h1 className="display-5 fw-bold text-white mb-3">
                Experience Cinema Like Never Before
              </h1>
              <p className="lead text-light mb-4" style={{ color: '#d1d5db' }}>
                Browse current blockbusters, select your preferred auditorium, and reserve
                your favorite seats with instant live availability tracking.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-secondary">IMAX with Laser</span>
                <span className="badge bg-secondary">Dolby Atmos</span>
                <span className="badge bg-secondary">4DX Motion</span>
                <span className="badge bg-secondary">VIP Lounges</span>
              </div>
            </div>
            <div className="col-lg-5 text-center mt-4 mt-lg-0">
              <img
                src="/assets/cinema-banner.png"
                alt="IMovies Cinema Banner"
                className="img-fluid rounded shadow"
                style={{
                  maxHeight: '260px',
                  objectFit: 'cover',
                  border: '2px solid #334155',
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container py-4">
        {/* Search & Filter Bar */}
        <div className="filter-bar shadow-sm">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">🔍</span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search movies by title, actors or director..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="">All Languages</option>
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-1">
              <button
                className="btn btn-imovies-outline w-100"
                onClick={() => {
                  setSearch('');
                  setSelectedGenre('');
                  setSelectedLanguage('');
                }}
                title="Reset Filters"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-dark m-0">Now Showing in Theatres</h3>
          <span className="text-muted small">
            Showing {movies?.length || 0} movies
          </span>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading movies...</span>
            </div>
            <p className="mt-2 text-muted">Retrieving movies and show schedules...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Movie Grid */}
        {!loading && (
          <div className="row">
            {movies?.length > 0 ? (
              movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p className="lead text-muted">
                  No movies match your selected filter criteria.
                </p>
                <button
                  className="btn btn-sm btn-imovies-primary"
                  onClick={() => {
                    setSearch('');
                    setSelectedGenre('');
                    setSelectedLanguage('');
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

