const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Please provide a unique Device ID'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a Device Name'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify the device type'],
      enum: [
        'Autonomous Robot',
        'Drone',
        'Autonomous Vehicle',
        'Industrial Robot',
      ],
      default: 'Autonomous Robot',
    },
    location: {
      type: String,
      required: [true, 'Please specify the operating sector or location'],
      default: 'Central Hub Alpha',
    },
    manufacturer: {
      type: String,
      default: 'AutoCloud Dynamics',
    },
    model: {
      type: String,
      default: 'Fleet-X1',
    },
    status: {
      type: String,
      enum: ['Online', 'Warning', 'Critical', 'Offline'],
      default: 'Online',
    },
    battery: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    speed: {
      type: Number,
      default: 0, // in km/h
    },
    temperature: {
      type: Number,
      default: 36, // in °C
    },
    signalStrength: {
      type: Number,
      min: 0,
      max: 100,
      default: 95, // in %
    },
    latitude: {
      type: Number,
      default: 13.0827,
    },
    longitude: {
      type: Number,
      default: 80.2707,
    },
    altitude: {
      type: Number,
      default: 0, // meters (for drones)
    },
    distanceTravelled: {
      type: Number,
      default: 0, // in km
    },
    currentMission: {
      type: String,
      default: 'Standby / Patrol',
    },
    missionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mission',
      default: null,
    },
    lastCommunication: {
      type: Date,
      default: Date.now,
    },
    isSimulated: {
      type: Boolean,
      default: true,
    },
    ipAddress: {
      type: String,
      default: '192.168.10.45',
    },
    firmwareVersion: {
      type: String,
      default: 'v3.2.0-cloud',
    },
  },
  {
    timestamps: true,
  }
);

// Index for high performance queries
deviceSchema.index({ status: 1, type: 1 });

module.exports = mongoose.model('Device', deviceSchema);
