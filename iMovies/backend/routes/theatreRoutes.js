const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getTheatres,
  getTheatre,
  createTheatre,
  updateTheatre,
  deleteTheatre,
  getCities,
} = require('../controllers/theatreController');

router.get('/meta/cities', getCities);

router
  .route('/')
  .get(getTheatres)
  .post(protect, adminOnly, createTheatre);

router
  .route('/:id')
  .get(getTheatre)
  .put(protect, adminOnly, updateTheatre)
  .delete(protect, adminOnly, deleteTheatre);

module.exports = router;

