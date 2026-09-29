const Device = require('../models/Device');
const Telemetry = require('../models/Telemetry');
const Mission = require('../models/Mission');
const Alert = require('../models/Alert');
const Notification = require('../models/Notification');
const socketService = require('../services/socketService');

// @desc    Get all devices with filters & search
// @route   GET /api/devices
// @access  Private
const getDevices = async (req, res, next) => {
  try {
    const { search, type, status, sort } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { deviceId: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    let deviceQuery = Device.find(query);

    if (sort === 'battery') deviceQuery = deviceQuery.sort({ battery: -1 });
    else if (sort === 'speed') deviceQuery = deviceQuery.sort({ speed: -1 });
    else if (sort === 'name') deviceQuery = deviceQuery.sort({ name: 1 });
    else deviceQuery = deviceQuery.sort({ updatedAt: -1 });

    const devices = await deviceQuery;

    res.status(200).json({
      success: true,
      count: devices.length,
      devices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single device by Mongo ID or Device ID
// @route   GET /api/devices/:id
// @access  Private
const getDeviceById = async (req, res, next) => {
  try {
    const param = req.params.id;
    let device;

    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      device = await Device.findById(param);
    } else {
      device = await Device.findOne({ deviceId: param.toUpperCase() });
    }

    if (!device) {
      return res.status(404).json({
        success: false,
        message: `Autonomous device '${param}' not found.`,
      });
    }

    // Fetch recent 20 telemetry entries for live charts
    const telemetryHistory = await Telemetry.find({ deviceId: device.deviceId })
      .sort({ timestamp: -1 })
      .limit(20);

    // Fetch active alerts for this device
    const activeAlerts = await Alert.find({ deviceId: device.deviceId, status: 'Active' })
      .sort({ createdAt: -1 });

    // Fetch recent missions
    const missions = await Mission.find({ deviceId: device.deviceId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      device,
      telemetryHistory: telemetryHistory.reverse(),
      activeAlerts,
      missions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new autonomous device
// @route   POST /api/devices
// @access  Private (Admin)
const createDevice = async (req, res, next) => {
  try {
    const {
      deviceId,
      name,
      type,
      location,
      manufacturer,
      model,
      battery,
      status,
      latitude,
      longitude,
    } = req.body;

    if (!deviceId || !name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Device ID, Name, and Device Type are required.',
      });
    }

    const exists = await Device.findOne({ deviceId: deviceId.toUpperCase() });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: `A device with ID '${deviceId.toUpperCase()}' already exists.`,
      });
    }

    const device = await Device.create({
      deviceId: deviceId.toUpperCase(),
      name,
      type,
      location: location || 'Sector 1 - Hub Alpha',
      manufacturer: manufacturer || 'AutoCloud Robotics',
      model: model || 'Gen-4 Autonomous Node',
      battery: battery !== undefined ? Number(battery) : 100,
      status: status || 'Online',
      latitude: latitude ? Number(latitude) : 13.0827 + (Math.random() * 0.05 - 0.025),
      longitude: longitude ? Number(longitude) : 80.2707 + (Math.random() * 0.05 - 0.025),
    });

    // Create initial telemetry packet
    await Telemetry.create({
      deviceId: device.deviceId,
      battery: device.battery,
      speed: device.speed,
      temperature: device.temperature,
      latitude: device.latitude,
      longitude: device.longitude,
      signalStrength: device.signalStrength,
      distanceTravelled: device.distanceTravelled,
      status: device.status,
      timestamp: new Date(),
    });

    // Create notification
    const notif = await Notification.create({
      title: 'New Autonomous Device Deployed',
      message: `${device.name} (${device.deviceId}) was registered to the cloud fleet.`,
      type: 'Device',
      severity: 'success',
      link: `/devices/${device._id}`,
    });

    socketService.broadcastDeviceUpdate(device);
    socketService.broadcastNotification(notif);

    res.status(201).json({
      success: true,
      message: 'Autonomous device registered successfully',
      device,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update device details
// @route   PUT /api/devices/:id
// @access  Private (Admin)
const updateDevice = async (req, res, next) => {
  try {
    const { id } = req.params;
    let device = await Device.findById(id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Autonomous device not found',
      });
    }

    const {
      name,
      type,
      location,
      manufacturer,
      model,
      status,
      battery,
      isSimulated,
    } = req.body;

    if (name) device.name = name;
    if (type) device.type = type;
    if (location) device.location = location;
    if (manufacturer) device.manufacturer = manufacturer;
    if (model) device.model = model;
    if (status) device.status = status;
    if (battery !== undefined) device.battery = Number(battery);
    if (isSimulated !== undefined) device.isSimulated = isSimulated;

    await device.save();

    socketService.broadcastDeviceUpdate(device);

    res.status(200).json({
      success: true,
      message: 'Device updated successfully',
      device,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete device
// @route   DELETE /api/devices/:id
// @access  Private (Admin)
const deleteDevice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const device = await Device.findById(id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Autonomous device not found',
      });
    }

    const deviceId = device.deviceId;
    await Device.findByIdAndDelete(id);

    // Clean up associated historical telemetry and alerts
    await Telemetry.deleteMany({ deviceId });
    await Alert.deleteMany({ deviceId });
    await Mission.deleteMany({ deviceId });

    res.status(200).json({
      success: true,
      message: `Device ${deviceId} and all cloud records removed successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send remote command to autonomous unit
// @route   POST /api/devices/:id/command
// @access  Private (Admin/Operator)
const sendDeviceCommand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { command } = req.body; // 'DOCK', 'EMERGENCY_STOP', 'RESUME_MISSION', 'RECALIBRATE'

    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    if (command === 'DOCK') {
      device.currentMission = 'Returning to Base Dock';
      device.speed = 10;
    } else if (command === 'EMERGENCY_STOP') {
      device.speed = 0;
      device.status = 'Warning';
      device.currentMission = 'EMERGENCY HALT ACTIVE';
    } else if (command === 'RESUME_MISSION') {
      device.status = 'Online';
      device.currentMission = 'Standard Autonomous Route';
    } else if (command === 'RECALIBRATE') {
      device.battery = 100;
      device.temperature = 36;
      device.signalStrength = 99;
      device.status = 'Online';
    }

    await device.save();
    socketService.broadcastDeviceUpdate(device);

    res.status(200).json({
      success: true,
      message: `Command '${command}' dispatched to ${device.deviceId}`,
      device,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  sendDeviceCommand,
};
