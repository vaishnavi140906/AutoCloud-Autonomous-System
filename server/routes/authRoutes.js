const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/users', protect, authorize('ADMIN'), getAllUsers);

module.exports = router;
