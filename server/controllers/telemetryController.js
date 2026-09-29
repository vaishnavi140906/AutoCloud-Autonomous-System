const Telemetry = require('../models/Telemetry');
const Device = require('../models/Device');
const alertEngine = require('../services/alertEngineService');
const socketService = require('../services/socketService');

// @desc    Ingest telemetry packet from device or simulator
// @route   POST /api/telemetry
// @access  Public / ApiKey / Private
const createTelemetry = async (req, res, next) => {
  try {
    const {
      deviceId,
      battery,
      speed,
      temperature,
      latitude,
      longitude,
      altitude,
      signalStrength,
      distanceTravelled,
      status,
    } = req.body;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: 'deviceId is required for telemetry ingestion',
      });
    }

    const telemetry = await Telemetry.create({
      deviceId: deviceId.toUpperCase(),
      battery: Number(battery) || 0,
      speed: Number(speed) || 0,
      temperature: Number(temperature) || 35,
      latitude: Number(latitude) || 13.0827,
      longitude: Number(longitude) || 80.2707,
      altitude: Number(altitude) || 0,
      signalStrength: Number(signalStrength) || 90,
      distanceTravelled: Number(distanceTravelled) || 0,
      status: status || 'Online',
      timestamp: new Date(),
    });

    // Update associated device state in database
    const device = await Device.findOne({ deviceId: deviceId.toUpperCase() });
    if (device) {
      device.battery = telemetry.battery;
      device.speed = telemetry.speed;
      device.temperature = telemetry.temperature;
      device.latitude = telemetry.latitude;
      device.longitude = telemetry.longitude;
      device.signalStrength = telemetry.signalStrength;
      device.distanceTravelled = telemetry.distanceTravelled;
      device.status = telemetry.status;
      device.lastCommunication = new Date();
      await device.save();

      // Trigger Alert Engine
      await alertEngine.evaluateTelemetry(device, telemetry);

      // Broadcast via socket
      socketService.broadcastTelemetry({
        ...telemetry.toObject(),
        deviceName: device.name,
        deviceType: device.type,
      });
      socketService.broadcastDeviceUpdate(device);
    }

    res.status(201).json({
      success: true,
      message: 'Telemetry logged and processed successfully',
      telemetry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get historical telemetry with pagination and filters
// @route   GET /api/telemetry
// @access  Private
const getTelemetryHistory = async (req, res, next) => {
  try {
    const { deviceId, status, limit = 50, page = 1, startDate, endDate } = req.query;
    const query = {};

    if (deviceId && deviceId !== 'All') {
      query.deviceId = deviceId.toUpperCase();
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Telemetry.countDocuments(query);
    const telemetryRecords = await Telemetry.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: telemetryRecords.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      telemetry: telemetryRecords,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get telemetry time-series for a specific device (for charts)
// @route   GET /api/telemetry/:deviceId
// @access  Private
const getDeviceTelemetry = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { limit = 30 } = req.query;

    const records = await Telemetry.find({ deviceId: deviceId.toUpperCase() })
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      deviceId: deviceId.toUpperCase(),
      count: records.length,
      telemetry: records.reverse(), // Chronological order for plotting
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export telemetry history as CSV
// @route   GET /api/telemetry/export/csv
// @access  Private
const exportTelemetryCSV = async (req, res, next) => {
  try {
    const { deviceId } = req.query;
    const query = deviceId && deviceId !== 'All' ? { deviceId: deviceId.toUpperCase() } : {};

    const records = await Telemetry.find(query)
      .sort({ timestamp: -1 })
      .limit(500);

    let csv = 'Timestamp,Device ID,Battery (%),Speed (km/h),Temp (°C),Signal (%),Latitude,Longitude,Distance (km),Status\n';

    records.forEach((r) => {
      csv += `"${r.timestamp.toISOString()}","${r.deviceId}",${r.battery},${r.speed},${r.temperature},${r.signalStrength},${r.latitude},${r.longitude},${r.distanceTravelled},"${r.status}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="autocloud-telemetry-export.csv"');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTelemetry,
  getTelemetryHistory,
  getDeviceTelemetry,
  exportTelemetryCSV,
};
