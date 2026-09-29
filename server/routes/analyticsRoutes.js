const express = require('express');
const router = express.Router();
const {
  getDashboardMetrics,
  getAnalyticalTrends,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardMetrics);
router.get('/trends', protect, getAnalyticalTrends);

module.exports = router;
