import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Checkout = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('customer@okaxis');
  const [cardDetails, setCardDetails] = useState({
    number: '4111 2222 3333 4444',
    name: 'Rahul Sharma',
    expiry: '12/28',
    cvv: '123',
  });
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get(`/bookings/${bookingId}`)
      .then((res) => {
        setBooking(res.data.data);
      })
      .catch((err) => {
        setErrorMsg('Unable to locate booking reservation.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [bookingId]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrorMsg('');

    try {
      const response = await api.post('/payments/process', {
        bookingId,
        paymentMethod,
      });

      if (response.data.success) {
        navigate(`/confirmation/${bookingId}`);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Payment processing failed. Please try again.'
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="mt-2 text-muted">Preparing secure transaction checkout...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">Booking not found or already processed.</div>
      </div>
    );
  }

  const show = booking.show;
  const movie = show?.movie;
  const theatre = show?.theatre;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="imovies-card shadow-sm mb-4">
            <h4 className="fw-bold text-dark border-bottom pb-3 mb-3">
              Order Summary & Ticket Confirmation
            </h4>

            <div className="row g-3">
              <div className="col-md-7">
                <h5 className="fw-bold text-dark mb-1">{movie?.title}</h5>
                <p className="text-muted small mb-2">
                  {movie?.language} &nbsp;|&nbsp; {movie?.genre?.join(', ')} &nbsp;|&nbsp;{' '}
                  {movie?.duration} mins
                </p>

                <p className="mb-1 text-secondary small">
                  🏛️ <strong>{theatre?.name}</strong> ({theatre?.city})
                </p>
                <p className="mb-1 text-secondary small">
                  🗓️ {new Date(show?.showDate).toLocaleDateString()} at{' '}
                  <strong>{show?.showTime}</strong>
                </p>
                <p className="mb-1 text-secondary small">
                  💺 Seats:{' '}
                  <span className="badge badge-solid badge-solid-accent">
                    {booking.seats?.join(', ')}
                  </span>
                </p>
                <p className="mb-0 text-secondary small">
                  Class: <strong>{booking.seatType?.toUpperCase()}</strong>
                </p>
              </div>

              <div className="col-md-5 border-start-md ps-md-4">
                <div className="bg-light p-3 rounded">
                  <div className="d-flex justify-content-between small text-secondary mb-2">
                    <span>Base Ticket Fare</span>
                    <span>₹{booking.totalAmount}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-secondary mb-2">
                    <span>Convenience Fee</span>
                    <span>₹0 (Waived)</span>
                  </div>
                  <div className="d-flex justify-content-between small text-secondary mb-2">
                    <span>Integrated GST (18%)</span>
                    <span>Included</span>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between fw-bold text-dark fs-5">
                    <span>Total Amount</span>
                    <span className="text-danger">₹{booking.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="imovies-card shadow-sm">
            <h5 className="fw-bold text-dark mb-3">Select Payment Method</h5>

            {errorMsg && (
              <div className="alert alert-danger" role="alert">
                {errorMsg}
              </div>
            )}

            <div className="btn-group w-100 mb-4" role="group">
              <button
                type="button"
                className={`btn ${
                  paymentMethod === 'upi' ? 'btn-imovies-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setPaymentMethod('upi')}
              >
                ⚡ UPI / QR
              </button>
              <button
                type="button"
                className={`btn ${
                  paymentMethod === 'credit_card' ? 'btn-imovies-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setPaymentMethod('credit_card')}
              >
                💳 Credit / Debit Card
              </button>
              <button
                type="button"
                className={`btn ${
                  paymentMethod === 'netbanking' ? 'btn-imovies-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setPaymentMethod('netbanking')}
              >
                🏦 Net Banking
              </button>
            </div>

            <form onSubmit={handlePayment}>
              {paymentMethod === 'upi' && (
                <div className="mb-3">
                  <label className="form-label small fw-bold">Virtual Payment Address (UPI ID)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. mobileNumber@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                  <div className="form-text small text-muted">
                    Instant zero-fee payment confirmation via Google Pay, PhonePe, or Paytm.
                  </div>
                </div>
              )}

              {paymentMethod === 'credit_card' && (
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-bold">Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cardDetails.number}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, number: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold">Expiry Date</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, expiry: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold">CVV</label>
                    <input
                      type="password"
                      maxLength="4"
                      className="form-control"
                      value={cardDetails.cvv}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cvv: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="mb-3">
                  <label className="form-label small fw-bold">Select Bank</label>
                  <select className="form-select">
                    <option>HDFC Bank</option>
                    <option>State Bank of India</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                <span className="small text-muted">🔒 256-Bit SSL Encrypted Transaction</span>
                <button
                  type="submit"
                  className="btn btn-imovies-primary px-4 py-2"
                  disabled={processing}
                >
                  {processing ? 'Processing Payment...' : `Pay ₹${booking.totalAmount} & Confirm Ticket`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

