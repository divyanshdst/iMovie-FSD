import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const fallbackPoster =
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';

  const posterSrc = movie.poster?.startsWith('http')
    ? movie.poster
    : movie.poster
    ? `http://localhost:5000${movie.poster}`
    : fallbackPoster;

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="movie-poster-card shadow-sm">
        <div style={{ position: 'relative' }}>
          <img
            src={posterSrc}
            alt={movie.title}
            className="movie-poster-img"
            onError={(e) => {
              e.target.src = fallbackPoster;
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: '#1a1a2e',
              color: '#ffffff',
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            ★ {movie.rating > 0 ? movie.rating.toFixed(1) : 'N/A'}
          </span>
        </div>

        <div className="movie-card-body">
          <div className="d-flex flex-wrap gap-1 mb-2">
            {movie.genre?.slice(0, 2).map((g, idx) => (
              <span key={idx} className="badge badge-solid badge-solid-dark">
                {g}
              </span>
            ))}
            <span className="badge badge-solid badge-solid-accent">
              {movie.language}
            </span>
          </div>

          <h5 className="fw-bold text-dark mb-1 text-truncate" title={movie.title}>
            {movie.title}
          </h5>

          <p className="text-muted small mb-3">
            ⏱️ {movie.duration} mins
          </p>

          <div className="mt-auto">
            <Link
              to={`/movies/${movie._id}`}
              className="btn btn-sm btn-imovies-primary w-100 text-center"
            >
              Book Tickets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

