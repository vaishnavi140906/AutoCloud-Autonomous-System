const express = require('express');
const router = express.Router();
const {
  getSystemStatus,
  toggleSimulation,
  setSimulationSpeed,
  resetDemoData,
} = require('../controllers/systemController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/status', getSystemStatus);
router.post('/simulation/toggle', protect, toggleSimulation);
router.post('/simulation/speed', protect, authorize('ADMIN'), setSimulationSpeed);
router.post('/reset-demo', protect, authorize('ADMIN'), resetDemoData);

module.exports = router;
