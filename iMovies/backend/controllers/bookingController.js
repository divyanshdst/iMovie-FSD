const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Notification = require('../models/Notification');

// @route   POST /api/bookings
// @desc    Reserve seats and create a pending booking
exports.createBooking = async (req, res, next) => {
  try {
    const { showId, seats, seatType = 'standard' } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide showId and an array of seats to book',
      });
    }

    if (seats.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 seats can be reserved in a single transaction',
      });
    }

    const show = await Show.findById(showId);
    if (!show || show.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Show is not available or has been cancelled',
      });
    }

    // Check if any seat is already booked
    const conflictSeats = seats.filter((seat) => show.bookedSeats.includes(seat));
    if (conflictSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats [${conflictSeats.join(', ')}] are already booked. Please choose other seats.`,
      });
    }

    // Calculate total price
    const pricePerSeat = show.ticketPrice[seatType] || show.ticketPrice.standard || 200;
    const totalAmount = seats.length * pricePerSeat;

    const booking = await Booking.create({
      user: req.user._id,
      show: showId,
      seats,
      seatType,
      totalAmount,
      status: 'pending',
    });

    // Mark seats as booked on show
    show.bookedSeats.push(...seats);
    // Remove from held seats if any
    show.heldSeats = show.heldSeats.filter((h) => !seats.includes(h.seatNumber));
    await show.save();

    // Broadcast seat reservation in real-time via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(showId.toString()).emit('seats-booked-live', {
        showId: showId.toString(),
        bookedSeats: show.bookedSeats,
      });
    }

    // Create user notification
    await Notification.create({
      user: req.user._id,
      title: 'Tickets Reserved 🎟️',
      message: `Your booking ${booking.bookingCode} for seats ${seats.join(', ')} is reserved. Complete payment to confirm.`,
      type: 'booking',
      link: `/checkout/${booking._id}`,
    });

    const populatedBooking = await Booking.findById(booking._id).populate({
      path: 'show',
      populate: [
        { path: 'movie', select: 'title poster duration genre rating' },
        { path: 'theatre', select: 'name city address' },
      ],
    });

    res.status(201).json({
      success: true,
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/bookings/my
// @desc    Get current user's bookings with pagination
exports.getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate({
          path: 'show',
          populate: [
            { path: 'movie', select: 'title poster duration genre rating' },
            { path: 'theatre', select: 'name city address' },
          ],
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Booking.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/bookings/:id
// @desc    Get single booking details
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate({
        path: 'show',
        populate: [
          { path: 'movie' },
          { path: 'theatre' },
        ],
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Role check: Only owner or admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking and release reserved seats
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled',
      });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'User cancelled reservation';
    await booking.save();

    // Release seats on the show
    const show = await Show.findById(booking.show);
    if (show) {
      show.bookedSeats = show.bookedSeats.filter(
        (seat) => !booking.seats.includes(seat)
      );
      await show.save();

      // Notify live watchers through socket
      const io = req.app.get('io');
      if (io) {
        io.to(show._id.toString()).emit('seats-released-live', {
          showId: show._id.toString(),
          releasedSeats: booking.seats,
          bookedSeats: show.bookedSeats,
        });
      }
    }

    // Create notification
    await Notification.create({
      user: booking.user,
      title: 'Booking Cancelled ℹ️',
      message: `Booking ${booking.bookingCode} has been cancelled. If payment was made, your refund is initiated.`,
      type: 'cancellation',
    });

    res.json({
      success: true,
      message: 'Booking cancelled and seats released successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

