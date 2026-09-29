const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    alertId: {
      type: String,
      unique: true,
      default: () => `ALT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
    deviceId: {
      type: String,
      required: [true, 'Device ID is required for alert'],
      uppercase: true,
    },
    alertType: {
      type: String,
      required: [true, 'Alert type is required'],
      enum: [
        'LOW_BATTERY',
        'HIGH_TEMPERATURE',
        'WEAK_SIGNAL',
        'DEVICE_OFFLINE',
        'OBSTACLE_DETECTED',
        'GEOFENCE_BREACH',
        'SYSTEM_ANOMALY',
      ],
      default: 'SYSTEM_ANOMALY',
    },
    severity: {
      type: String,
      enum: ['Info', 'Warning', 'Critical'],
      default: 'Warning',
    },
    message: {
      type: String,
      required: [true, 'Alert message is required'],
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved'],
      default: 'Active',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolvedBy: {
      type: String,
      default: null,
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

alertSchema.index({ status: 1, severity: 1, createdAt: -1 });
alertSchema.index({ deviceId: 1 });

module.exports = mongoose.model('Alert', alertSchema);
