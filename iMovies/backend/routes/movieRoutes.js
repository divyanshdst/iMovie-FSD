const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getGenres,
  getLanguages,
} = require('../controllers/movieController');

router.get('/meta/genres', getGenres);
router.get('/meta/languages', getLanguages);

router
  .route('/')
  .get(getMovies)
  .post(protect, adminOnly, upload.single('poster'), createMovie);

router
  .route('/:id')
  .get(getMovie)
  .put(protect, adminOnly, upload.single('poster'), updateMovie)
  .delete(protect, adminOnly, deleteMovie);

module.exports = router;

