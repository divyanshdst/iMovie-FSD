const Theatre = require('../models/Theatre');

// @route   GET /api/theatres
// @desc    Get all theatres with optional city filter
exports.getTheatres = async (req, res, next) => {
  try {
    const { city } = req.query;
    const query = { isActive: true };

    if (city) {
      query.city = new RegExp(city, 'i');
    }

    const theatres = await Theatre.find(query).sort({ name: 1 });

    res.json({
      success: true,
      count: theatres.length,
      data: theatres,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/theatres/:id
// @desc    Get single theatre details
exports.getTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre || !theatre.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    res.json({
      success: true,
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/theatres
// @desc    Add theatre (Admin only)
exports.createTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json({
      success: true,
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/theatres/:id
// @desc    Update theatre (Admin only)
exports.updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    res.json({
      success: true,
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/theatres/:id
// @desc    Deactivate theatre (Admin only)
exports.deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    res.json({
      success: true,
      message: 'Theatre deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/theatres/meta/cities
// @desc    Get distinct cities
exports.getCities = async (req, res, next) => {
  try {
    const cities = await Theatre.distinct('city', { isActive: true });
    res.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};

