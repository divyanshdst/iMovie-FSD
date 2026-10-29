import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="app-navbar">
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand */}
        <Link to="/" className="brand-logo text-decoration-none">
          🎬 i<span>Movies</span>
        </Link>

        {/* Navigation links */}
        <div className="d-flex align-items-center gap-3">
          <Link
            to="/"
            className={`nav-link-custom ${isActive('/') ? 'active' : ''}`}
          >
            Movies
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-bookings"
                className={`nav-link-custom ${isActive('/my-bookings') ? 'active' : ''}`}
              >
                My Bookings
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className={`nav-link-custom ${
                    location.pathname.startsWith('/admin') ? 'active' : ''
                  }`}
                >
                  Admin Console
                </Link>
              )}

              <div className="d-flex align-items-center gap-2 ms-2">
                <span className="badge badge-solid badge-solid-dark">
                  👤 {user?.name} {user?.role === 'admin' && '(Admin)'}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-light"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-sm btn-outline-light">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-sm btn-imovies-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

