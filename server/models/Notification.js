const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null means global notification to all active operators/admins
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Alert', 'Mission', 'Device', 'System', 'Security'],
      default: 'System',
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'error', 'success'],
      default: 'info',
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
