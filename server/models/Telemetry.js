const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Device ID is required for telemetry packet'],
      uppercase: true,
    },
    battery: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    altitude: {
      type: Number,
      default: 0,
    },
    signalStrength: {
      type: Number,
      required: true,
    },
    distanceTravelled: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'Online',
    },
    cpuUsage: {
      type: Number,
      default: 25,
    },
    memoryUsage: {
      type: Number,
      default: 40,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Compound index for time-series queries
telemetrySchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model('Telemetry', telemetrySchema);
