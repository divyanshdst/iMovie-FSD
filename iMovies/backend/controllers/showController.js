const Show = require('../models/Show');
const Movie = require('../models/Movie');

// @route   GET /api/shows
// @desc    Get shows filtered by movie, theatre, date, or city
exports.getShows = async (req, res, next) => {
  try {
    const { movieId, theatreId, date, city } = req.query;
    const query = { status: 'active' };

    if (movieId) {
      query.movie = movieId;
    }

    if (theatreId) {
      query.theatre = theatreId;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.showDate = { $gte: startOfDay, $lte: endOfDay };
    }

    let shows = await Show.find(query)
      .populate('movie', 'title poster duration language genre rating')
      .populate('theatre', 'name address city')
      .sort({ showDate: 1, showTime: 1 });

    if (city) {
      shows = shows.filter(
        (show) =>
          show.theatre &&
          show.theatre.city &&
          show.theatre.city.toLowerCase() === city.toLowerCase()
      );
    }

    res.json({
      success: true,
      count: shows.length,
      data: shows,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/shows/:id
// @desc    Get show details and populated data
exports.getShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theatre');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.json({
      success: true,
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/shows/:id/seats
// @desc    Get real-time seat availability for a show
exports.getShowSeats = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id).populate('theatre');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    // Clean up held seats that expired (older than 8 minutes)
    const eightMinutesAgo = new Date(Date.now() - 8 * 60 * 1000);
    show.heldSeats = show.heldSeats.filter((h) => h.heldAt > eightMinutesAgo);
    await show.save();

    res.json({
      success: true,
      data: {
        totalSeats: show.totalSeats,
        bookedSeats: show.bookedSeats,
        heldSeats: show.heldSeats,
        ticketPrice: show.ticketPrice,
        showId: show._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/shows
// @desc    Create show schedule (Admin only)
exports.createShow = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.body.movie);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Referenced movie does not exist',
      });
    }

    const show = await Show.create(req.body);

    res.status(201).json({
      success: true,
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/shows/:id
// @desc    Update show (Admin only)
exports.updateShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.json({
      success: true,
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/shows/:id
// @desc    Cancel show (Admin only)
exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.json({
      success: true,
      message: 'Show successfully cancelled',
    });
  } catch (error) {
    next(error);
  }
};

