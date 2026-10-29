const Movie = require('../models/Movie');

// @route   GET /api/movies
// @desc    Get all movies with filtering, text search & pagination
exports.getMovies = async (req, res, next) => {
  try {
    const { genre, language, search, page = 1, limit = 12, sort = '-releaseDate' } = req.query;

    const query = { isActive: true };

    if (genre) {
      query.genre = { $in: [new RegExp(genre, 'i')] };
    }

    if (language) {
      query.language = new RegExp(language, 'i');
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [movies, total] = await Promise.all([
      Movie.find(query).sort(sort).skip(skip).limit(limitNum),
      Movie.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: movies,
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

// @route   GET /api/movies/:id
// @desc    Get movie details by ID
exports.getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || !movie.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/movies
// @desc    Create a new movie (Admin only)
exports.createMovie = async (req, res, next) => {
  try {
    const movieData = { ...req.body };

    if (req.file) {
      movieData.poster = `/uploads/${req.file.filename}`;
    }

    if (typeof movieData.genre === 'string') {
      movieData.genre = movieData.genre.split(',').map((g) => g.trim());
    }

    const movie = await Movie.create(movieData);

    res.status(201).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/movies/:id
// @desc    Update movie (Admin only)
exports.updateMovie = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.poster = `/uploads/${req.file.filename}`;
    }

    if (typeof updateData.genre === 'string') {
      updateData.genre = updateData.genre.split(',').map((g) => g.trim());
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/movies/:id
// @desc    Soft delete movie (Admin only)
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.json({
      success: true,
      message: 'Movie successfully deactivated',
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/movies/meta/genres
// @desc    Get list of unique genres
exports.getGenres = async (req, res, next) => {
  try {
    const genres = await Movie.distinct('genre', { isActive: true });
    res.json({
      success: true,
      data: genres,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/movies/meta/languages
// @desc    Get list of unique languages
exports.getLanguages = async (req, res, next) => {
  try {
    const languages = await Movie.distinct('language', { isActive: true });
    res.json({
      success: true,
      data: languages,
    });
  } catch (error) {
    next(error);
  }
};

