const express = require('express');
const router = express.Router();
const {
  createTelemetry,
  getTelemetryHistory,
  getDeviceTelemetry,
  exportTelemetryCSV,
} = require('../controllers/telemetryController');
const { protect } = require('../middleware/authMiddleware');

// Ingest telemetry (open for simulated agents / IoT devices / REST clients)
router.post('/', createTelemetry);

// Query telemetry history
router.get('/', protect, getTelemetryHistory);
router.get('/export/csv', protect, exportTelemetryCSV);
router.get('/:deviceId', protect, getDeviceTelemetry);

module.exports = router;
