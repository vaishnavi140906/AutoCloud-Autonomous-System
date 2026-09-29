const express = require('express');
const router = express.Router();
const {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  sendDeviceCommand,
} = require('../controllers/deviceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, getDevices)
  .post(protect, authorize('ADMIN'), createDevice);

router.route('/:id')
  .get(protect, getDeviceById)
  .put(protect, authorize('ADMIN'), updateDevice)
  .delete(protect, authorize('ADMIN'), deleteDevice);

router.post('/:id/command', protect, sendDeviceCommand);

module.exports = router;
