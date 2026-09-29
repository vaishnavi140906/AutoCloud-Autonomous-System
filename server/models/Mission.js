const mongoose = require('mongoose');

const waypointSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  label: { type: String, default: 'Waypoint' },
  completed: { type: Boolean, default: false },
});

const missionSchema = new mongoose.Schema(
  {
    missionName: {
      type: String,
      required: [true, 'Please provide a Mission Name'],
      trim: true,
    },
    deviceId: {
      type: String,
      required: [true, 'Please assign a device for this mission'],
      uppercase: true,
    },
    source: {
      type: String,
      required: [true, 'Please specify the starting location'],
    },
    destination: {
      type: String,
      required: [true, 'Please specify the destination location'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    estimatedCompletion: {
      type: Date,
    },
    actualCompletion: {
      type: Date,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Completed', 'Failed', 'Cancelled'],
      default: 'Active',
    },
    waypoints: [waypointSchema],
    description: {
      type: String,
      default: '',
    },
    payloadWeight: {
      type: Number, // in kg
      default: 5.0,
    },
  },
  {
    timestamps: true,
  }
);

missionSchema.index({ status: 1, deviceId: 1 });

module.exports = mongoose.model('Mission', missionSchema);
