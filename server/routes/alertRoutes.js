const express = require('express');
const router = express.Router();
const {
  getAlerts,
  resolveAlert,
  injectAnomaly,
  clearResolvedAlerts,
} = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, getAlerts);
router.put('/:id/resolve', protect, resolveAlert);
router.post('/inject', protect, injectAnomaly);
router.delete('/clear-resolved', protect, authorize('ADMIN'), clearResolvedAlerts);

module.exports = router;
