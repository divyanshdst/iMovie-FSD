const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// @route   POST /api/payments/process
// @desc    Process ticket payment and confirm booking
exports.processPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentMethod = 'upi' } = req.body;

    const booking = await Booking.findById(bookingId).populate({
      path: 'show',
      populate: [
        { path: 'movie', select: 'title' },
        { path: 'theatre', select: 'name' },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this booking',
      });
    }

    if (booking.status === 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been paid and confirmed',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot process payment for a cancelled booking',
      });
    }

    // Create payment entry
    const payment = await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalAmount,
      paymentMethod,
      status: 'completed',
      gatewayResponse: {
        provider: 'IMovies Secure Mock Gateway',
        authCode: `AUTH_${Math.floor(100000 + Math.random() * 900000)}`,
        verified: true,
      },
    });

    // Update booking status
    booking.status = 'confirmed';
    await booking.save();

    // Create notification
    await Notification.create({
      user: req.user._id,
      title: 'Payment Successful! 🎉',
      message: `Your payment of ₹${payment.amount} for "${booking.show.movie.title}" was successful. Booking Confirmed!`,
      type: 'payment',
      link: `/confirmation/${booking._id}`,
    });

    res.status(200).json({
      success: true,
      message: 'Payment completed and booking confirmed',
      data: {
        payment,
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/payments/:id
// @desc    Get payment receipt
exports.getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found',
      });
    }

    if (
      payment.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this receipt',
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

