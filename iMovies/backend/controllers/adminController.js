const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @route   GET /api/admin/dashboard
// @desc    Get system-wide analytics and summary metrics
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalMovies,
      totalTheatres,
      totalShows,
      totalBookings,
      confirmedBookings,
      revenueResult,
      recentBookings,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Movie.countDocuments({ isActive: true }),
      Theatre.countDocuments({ isActive: true }),
      Show.countDocuments({ status: 'active' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
      ]),
      Booking.find()
        .populate('user', 'name email')
        .populate({
          path: 'show',
          populate: [
            { path: 'movie', select: 'title' },
            { path: 'theatre', select: 'name city' },
          ],
        })
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalMovies,
        totalTheatres,
        totalShows,
        totalBookings,
        confirmedBookings,
        totalRevenue,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/admin/users
// @desc    Get all users with pagination
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: users,
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

// @route   PUT /api/admin/users/:id/toggle
// @desc    Toggle user active/inactive status
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/admin/bookings
// @desc    Get all bookings across the platform
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('user', 'name email phone')
        .populate({
          path: 'show',
          populate: [
            { path: 'movie', select: 'title duration genre' },
            { path: 'theatre', select: 'name city' },
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

