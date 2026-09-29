const Mission = require('../models/Mission');
const Device = require('../models/Device');
const Notification = require('../models/Notification');
const socketService = require('../services/socketService');

// @desc    Get all missions with filters
// @route   GET /api/missions
// @access  Private
const getMissions = async (req, res, next) => {
  try {
    const { status, priority, deviceId } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (deviceId && deviceId !== 'All') query.deviceId = deviceId.toUpperCase();

    const missions = await Mission.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: missions.length,
      missions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single mission by ID
// @route   GET /api/missions/:id
// @access  Private
const getMissionById = async (req, res, next) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ success: false, message: 'Mission not found' });
    }
    res.status(200).json({ success: true, mission });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new autonomous mission
// @route   POST /api/missions
// @access  Private (Admin/Operator)
const createMission = async (req, res, next) => {
  try {
    const {
      missionName,
      deviceId,
      source,
      destination,
      priority,
      estimatedMinutes = 30,
      description,
      payloadWeight,
    } = req.body;

    if (!missionName || !deviceId || !source || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Mission Name, Device, Source, and Destination are required.',
      });
    }

    const estimatedCompletion = new Date(Date.now() + Number(estimatedMinutes) * 60 * 1000);

    const mission = await Mission.create({
      missionName,
      deviceId: deviceId.toUpperCase(),
      source,
      destination,
      priority: priority || 'Medium',
      estimatedCompletion,
      description: description || '',
      payloadWeight: Number(payloadWeight) || 5.0,
      progress: 0,
      status: 'Active',
    });

    // Link mission to device
    const device = await Device.findOne({ deviceId: deviceId.toUpperCase() });
    if (device) {
      device.currentMission = `${source} → ${destination}`;
      device.missionId = mission._id;
      await device.save();
      socketService.broadcastDeviceUpdate(device);
    }

    const notif = await Notification.create({
      title: 'New Mission Dispatched',
      message: `Mission "${mission.missionName}" assigned to ${deviceId}`,
      type: 'Mission',
      severity: 'info',
      link: '/missions',
    });

    socketService.broadcastMissionUpdate(mission);
    socketService.broadcastNotification(notif);

    res.status(201).json({
      success: true,
      message: 'Mission initialized and dispatched successfully',
      mission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update mission status or progress
// @route   PUT /api/missions/:id
// @access  Private (Admin/Operator)
const updateMission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, progress, priority, description } = req.body;

    const mission = await Mission.findById(id);
    if (!mission) {
      return res.status(404).json({ success: false, message: 'Mission not found' });
    }

    if (status) mission.status = status;
    if (progress !== undefined) mission.progress = Number(progress);
    if (priority) mission.priority = priority;
    if (description) mission.description = description;

    if (status === 'Completed' || progress >= 100) {
      mission.progress = 100;
      mission.status = 'Completed';
      mission.actualCompletion = new Date();

      // Free up assigned device
      const device = await Device.findOne({ deviceId: mission.deviceId });
      if (device && device.missionId && device.missionId.toString() === mission._id.toString()) {
        device.currentMission = 'Standby / Patrol';
        device.missionId = null;
        await device.save();
        socketService.broadcastDeviceUpdate(device);
      }
    }

    await mission.save();
    socketService.broadcastMissionUpdate(mission);

    res.status(200).json({
      success: true,
      message: 'Mission updated successfully',
      mission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or cancel mission
// @route   DELETE /api/missions/:id
// @access  Private (Admin)
const deleteMission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mission = await Mission.findById(id);
    if (!mission) {
      return res.status(404).json({ success: false, message: 'Mission not found' });
    }

    // Unlink from device if active
    const device = await Device.findOne({ deviceId: mission.deviceId });
    if (device && device.missionId && device.missionId.toString() === mission._id.toString()) {
      device.currentMission = 'Standby / Patrol';
      device.missionId = null;
      await device.save();
      socketService.broadcastDeviceUpdate(device);
    }

    await Mission.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Mission deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMissions,
  getMissionById,
  createMission,
  updateMission,
  deleteMission,
};
