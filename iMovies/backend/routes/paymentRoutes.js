const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  processPayment,
  getPayment,
} = require('../controllers/paymentController');

router.use(protect);

router.post('/process', processPayment);
router.get('/:id', getPayment);

module.exports = router;

