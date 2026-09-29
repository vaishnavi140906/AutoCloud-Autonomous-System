const Notification = require('../models/Notification');

// @desc    Get all notifications with unread count
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(40);
    const unreadCount = await Notification.countDocuments({ read: false });

    res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all notifications
// @route   DELETE /api/notifications/clear
// @access  Private
const clearNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany();
    res.status(200).json({
      success: true,
      message: 'Notification tray cleared',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
};
