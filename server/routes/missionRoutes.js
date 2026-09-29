const express = require('express');
const router = express.Router();
const {
  getMissions,
  getMissionById,
  createMission,
  updateMission,
  deleteMission,
} = require('../controllers/missionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, getMissions)
  .post(protect, createMission);

router.route('/:id')
  .get(protect, getMissionById)
  .put(protect, updateMission)
  .delete(protect, authorize('ADMIN'), deleteMission);

module.exports = router;
