const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getShows,
  getShow,
  createShow,
  updateShow,
  deleteShow,
  getShowSeats,
} = require('../controllers/showController');

router
  .route('/')
  .get(getShows)
  .post(protect, adminOnly, createShow);

router.get('/:id/seats', getShowSeats);

router
  .route('/:id')
  .get(getShow)
  .put(protect, adminOnly, updateShow)
  .delete(protect, adminOnly, deleteShow);

module.exports = router;

