import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails } from '../redux/slices/movieSlice';
import api from '../services/api';

const MovieDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedMovie: movie, loading } = useSelector((state) => state.movies);

  const [shows, setShows] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);
  const [showsLoading, setShowsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchMovieDetails(id));
    // Fetch available cities
    api.get('/theatres/meta/cities').then((res) => setCities(res.data.data || [])).catch(() => {});
  }, [dispatch, id]);

  useEffect(() => {
    setShowsLoading(true);
    const query = selectedCity ? `?movieId=${id}&city=${selectedCity}` : `?movieId=${id}`;
    api
      .get(`/shows${query}`)
      .then((res) => {
        setShows(res.data.data || []);
      })
      .catch(() => {
        setShows([]);
      })
      .finally(() => {
        setShowsLoading(false);
      });
  }, [id, selectedCity]);

  if (loading || !movie) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="mt-2 text-muted">Loading movie presentation...</p>
      </div>
    );
  }

  const fallbackPoster =
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
  const posterSrc = movie.poster?.startsWith('http')
    ? movie.poster
    : movie.poster
    ? `http://localhost:5000${movie.poster}`
    : fallbackPoster;

  // Group shows by Theatre
  const theatreGroupedShows = shows.reduce((acc, show) => {
    const theatreId = show.theatre?._id || 'general';
    if (!acc[theatreId]) {
      acc[theatreId] = {
        theatre: show.theatre,
        shows: [],
      };
    }
    acc[theatreId].shows.push(show);
    return acc;
  }, {});

  return (
    <div className="container py-4">
      {/* Movie Details Header Card */}
      <div className="imovies-card shadow-sm mb-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-3 text-center">
            <img
              src={posterSrc}
              alt={movie.title}
              className="img-fluid rounded shadow"
              style={{ maxHeight: '350px', width: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = fallbackPoster;
              }}
            />
          </div>

          <div className="col-md-9">
            <div className="d-flex flex-wrap gap-2 mb-2">
              {movie.genre?.map((g, idx) => (
                <span key={idx} className="badge badge-solid badge-solid-dark">
                  {g}
                </span>
              ))}
              <span className="badge badge-solid badge-solid-accent">
                {movie.language}
              </span>
              <span className="badge badge-solid badge-solid-warning">
                ★ {movie.rating > 0 ? movie.rating.toFixed(1) : '8.5'} / 10
              </span>
            </div>

            <h2 className="fw-bold text-dark mb-2">{movie.title}</h2>
            <p className="text-muted small mb-3">
              ⏱️ Duration: <strong>{movie.duration} minutes</strong> &nbsp;|&nbsp;
              Director: <strong>{movie.director || 'Christopher Nolan'}</strong>
            </p>

            <h6 className="fw-bold text-dark">Synopsis</h6>
            <p className="text-secondary">{movie.description}</p>

            {movie.cast?.length > 0 && (
              <div>
                <h6 className="fw-bold text-dark mb-2">Key Cast</h6>
                <div className="d-flex flex-wrap gap-2">
                  {movie.cast.map((actor, idx) => (
                    <span
                      key={idx}
                      className="border rounded px-2 py-1 small bg-light text-dark"
                    >
                      🎭 {actor.name} {actor.role && `(${actor.role})`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Showtimes & Theatres Section */}
      <div className="imovies-card shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <h4 className="fw-bold text-dark mb-1">Select Theatre & Showtimes</h4>
            <p className="text-muted small mb-0">
              Pick your preferred auditorium and show timing to reserve your seats
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
            <label className="fw-bold small text-muted">City:</label>
            <select
              className="form-select form-select-sm"
              style={{ width: '180px' }}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showsLoading && (
          <div className="text-center py-4">
            <div className="spinner-border text-danger spinner-border-sm" role="status"></div>
            <span className="ms-2 text-muted small">Loading auditoriums...</span>
          </div>
        )}

        {!showsLoading && Object.keys(theatreGroupedShows).length === 0 && (
          <div className="text-center py-4 text-muted">
            <p>No active shows scheduled for this movie in the selected region.</p>
          </div>
        )}

        {!showsLoading &&
          Object.values(theatreGroupedShows).map((group, idx) => (
            <div key={idx} className="border-bottom py-3">
              <div className="d-flex flex-wrap justify-content-between align-items-start mb-2">
                <div>
                  <h5 className="fw-bold text-dark mb-1">
                    🏛️ {group.theatre?.name || 'Grand Cinema Megaplex'}
                  </h5>
                  <p className="text-muted small mb-1">
                    📍 {group.theatre?.address}, {group.theatre?.city}
                  </p>
                  <div className="d-flex gap-1 flex-wrap">
                    {group.theatre?.amenities?.map((amenity, aIdx) => (
                      <span key={aIdx} className="badge bg-light text-secondary border small">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-md-end mt-2 mt-md-0">
                  <span className="text-muted small d-block">
                    Standard: <strong>₹{group.shows[0]?.ticketPrice?.standard || 200}</strong>
                  </span>
                  <span className="text-muted small d-block">
                    Premium: <strong>₹{group.shows[0]?.ticketPrice?.premium || 350}</strong>
                  </span>
                </div>
              </div>

              {/* Show Time Slot Pills */}
              <div className="d-flex flex-wrap gap-2 mt-3">
                {group.shows.map((show) => (
                  <Link
                    key={show._id}
                    to={`/seats/${show._id}`}
                    className="btn btn-outline-dark fw-bold btn-sm py-2 px-3 text-center"
                    style={{ minWidth: '110px' }}
                  >
                    <div>{show.showTime}</div>
                    <span className="small text-success d-block" style={{ fontSize: '0.7rem' }}>
                      Screen {show.screenNumber || 1}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MovieDetails;

