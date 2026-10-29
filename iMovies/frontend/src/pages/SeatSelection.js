import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createReservation } from '../redux/slices/bookingSlice';
import api from '../services/api';
import socket from '../services/socket';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [show, setShow] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [liveHeldSeats, setLiveHeldSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Rows and seat layout
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = 10;

  // Load Show & Seat Details
  useEffect(() => {
    setLoading(true);
    api
      .get(`/shows/${showId}`)
      .then((res) => {
        const showData = res.data.data;
        setShow(showData);
        setBookedSeats(showData.bookedSeats || []);
      })
      .catch((err) => {
        setErrorMsg('Unable to load show data. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showId]);

  // Real-time Socket.io listeners
  useEffect(() => {
    // Join show room
    socket.emit('join-show', showId);

    // Live seat booked by another user
    socket.on('seats-booked-live', (data) => {
      if (data.showId === showId) {
        setBookedSeats(data.bookedSeats);
        // If current user had any of those selected, remove them
        setSelectedSeats((prev) =>
          prev.filter((seat) => !data.bookedSeats.includes(seat))
        );
      }
    });

    // Live seat released
    socket.on('seats-released-live', (data) => {
      if (data.showId === showId) {
        setBookedSeats(data.bookedSeats);
      }
    });

    // Live seat selection by peer
    socket.on('seat-selected-live', ({ seatNumber, userId }) => {
      if (userId !== user?._id) {
        setLiveHeldSeats((prev) => [...prev, seatNumber]);
      }
    });

    socket.on('seat-deselected-live', ({ seatNumber, userId }) => {
      if (userId !== user?._id) {
        setLiveHeldSeats((prev) => prev.filter((s) => s !== seatNumber));
      }
    });

    return () => {
      socket.off('seats-booked-live');
      socket.off('seats-released-live');
      socket.off('seat-selected-live');
      socket.off('seat-deselected-live');
    };
  }, [showId, user]);

  const toggleSeat = (seatCode) => {
    if (bookedSeats.includes(seatCode)) return;

    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatCode));
      socket.emit('seat-deselect', {
        showId,
        seatNumber: seatCode,
        userId: user?._id,
      });
    } else {
      if (selectedSeats.length >= 10) {
        alert('You can select a maximum of 10 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatCode]);
      socket.emit('seat-select', {
        showId,
        seatNumber: seatCode,
        userId: user?._id,
      });
    }
  };

  // Tier pricing calculation
  const getSeatTier = (row) => {
    if (row === 'F') return 'vip';
    if (row === 'D' || row === 'E') return 'premium';
    return 'standard';
  };

  const calculateTotal = useMemo(() => {
    if (!show) return 0;
    return selectedSeats.reduce((acc, seat) => {
      const row = seat.charAt(0);
      const tier = getSeatTier(row);
      const price = show.ticketPrice?.[tier] || show.ticketPrice?.standard || 200;
      return acc + price;
    }, 0);
  }, [selectedSeats, show]);

  const handleProceedToBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat before proceeding.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const primaryTier = getSeatTier(selectedSeats[0].charAt(0));
      const resultAction = await dispatch(
        createReservation({
          showId,
          seats: selectedSeats,
          seatType: primaryTier,
        })
      );

      if (createReservation.fulfilled.match(resultAction)) {
        const booking = resultAction.payload;
        navigate(`/checkout/${booking._id}`);
      } else {
        setErrorMsg(resultAction.payload || 'Failed to create reservation');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred while reserving seats.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="mt-2 text-muted">Synchronizing live auditorium seating plan...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Show Information Card */}
      <div className="imovies-card shadow-sm mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h4 className="fw-bold text-dark mb-1">🎬 {show?.movie?.title}</h4>
            <p className="text-muted small mb-0">
              🏛️ {show?.theatre?.name} &nbsp;|&nbsp; 🗓️{' '}
              {new Date(show?.showDate).toLocaleDateString()} at {show?.showTime} &nbsp;|&nbsp;
              Screen {show?.screenNumber}
            </p>
          </div>
          <div className="mt-2 mt-md-0">
            <span className="badge badge-solid badge-solid-success">
              ⚡ Real-Time Socket Connected
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

      {/* Seat Layout Card */}
      <div className="imovies-card shadow-sm text-center">
        {/* Screen Indicator */}
        <div className="screen-indicator">
          ALL EYES THIS WAY — CINEMA SCREEN
        </div>

        {/* Seat Grid */}
        <div className="d-flex flex-column align-items-center my-4 overflow-auto">
          {rows.map((row) => {
            const tier = getSeatTier(row);
            return (
              <div key={row} className="seat-row">
                <span className="seat-row-label">{row}</span>
                {Array.from({ length: seatsPerRow }, (_, i) => {
                  const seatCode = `${row}${i + 1}`;
                  const isBooked = bookedSeats.includes(seatCode);
                  const isSelected = selectedSeats.includes(seatCode);
                  const isHeld = liveHeldSeats.includes(seatCode);

                  let seatClass = 'seat-available';
                  if (isBooked) seatClass = 'seat-booked';
                  else if (isSelected) seatClass = 'seat-selected';
                  else if (isHeld) seatClass = 'seat-held';

                  return (
                    <div
                      key={seatCode}
                      className={`seat-box ${seatClass}`}
                      onClick={() => toggleSeat(seatCode)}
                      title={`${seatCode} (${tier.toUpperCase()})`}
                    >
                      {seatCode}
                    </div>
                  );
                })}
                <span className="seat-row-label text-end">{row}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="d-flex flex-wrap justify-content-center gap-4 mt-4 pt-3 border-top">
          <div className="seat-legend-item">
            <div className="seat-box seat-available" style={{ width: 22, height: 22 }}></div>
            <span>Available</span>
          </div>
          <div className="seat-legend-item">
            <div className="seat-box seat-selected" style={{ width: 22, height: 22 }}></div>
            <span>Selected</span>
          </div>
          <div className="seat-legend-item">
            <div className="seat-box seat-booked" style={{ width: 22, height: 22 }}></div>
            <span>Occupied</span>
          </div>
          <div className="seat-legend-item">
            <div className="seat-box seat-held" style={{ width: 22, height: 22 }}></div>
            <span>Live Hold</span>
          </div>
        </div>

        <div className="d-flex justify-content-center gap-4 mt-2 small text-muted">
          <span>Row A-C: Standard (₹{show?.ticketPrice?.standard || 200})</span>
          <span>Row D-E: Premium (₹{show?.ticketPrice?.premium || 350})</span>
          <span>Row F: VIP Luxury (₹{show?.ticketPrice?.vip || 500})</span>
        </div>
      </div>

      {/* Reservation Summary Footer */}
      <div className="imovies-card shadow-sm d-flex flex-wrap justify-content-between align-items-center">
        <div>
          <h5 className="fw-bold mb-1">
            Selected Seats ({selectedSeats.length}):{' '}
            <span className="text-danger">
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
            </span>
          </h5>
          <span className="text-muted small">
            Total Payable: <strong className="text-dark fs-5">₹{calculateTotal}</strong> (incl. of taxes)
          </span>
        </div>

        <button
          className="btn btn-imovies-primary px-4 py-2"
          onClick={handleProceedToBooking}
          disabled={selectedSeats.length === 0 || submitting}
        >
          {submitting ? 'Locking Seats...' : 'Proceed to Checkout 💳'}
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;

