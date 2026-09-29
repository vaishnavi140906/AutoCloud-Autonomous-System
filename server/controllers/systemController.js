const simulatorService = require('../services/simulatorService');
const { seedInitialData } = require('../seed/initialData');
const socketService = require('../services/socketService');

// @desc    Get cloud platform health, database status, simulator state
// @route   GET /api/system/status
// @access  Public / Private
const getSystemStatus = async (req, res, next) => {
  try {
    const simState = simulatorService.getSimulationState();
    const mongoose = require('mongoose');

    const status = {
      systemName: 'AutoCloud – Cloud Autonomous System Management Platform',
      version: '1.0.0-PROD',
      environment: process.env.NODE_ENV || 'development',
      serverTime: new Date(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        status: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected',
        host: mongoose.connection.host || 'Cloud-Memory-Cluster',
        databaseName: mongoose.connection.name || 'autocloud',
      },
      simulation: {
        active: simState.isActive,
        tickRateMs: simState.tickRateMs,
        mode: 'SIMULATION MODE (Physics-Backed Synthetic Autonomous Stream)',
        isRealHardware: false,
      },
      cloudCapabilities: [
        'Centralized Telemetry Pipeline',
        'Dynamic Multi-Vehicle Fleet Tracking',
        'Rule-Based Anomaly Detection Engine',
        'Bidirectional WebSocket Streaming (Socket.IO)',
        'Cloud Database as a Service (MongoDB Atlas / In-Memory)',
        'Role-Based Fleet Security & Authentication',
      ],
    };

    res.status(200).json({ success: true, status });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle simulation active/paused
// @route   POST /api/system/simulation/toggle
// @access  Private (Admin/Operator)
const toggleSimulation = async (req, res, next) => {
  try {
    const { active } = req.body;
    const result = simulatorService.toggleSimulation(active);
    socketService.broadcastSimulationStatus(result);

    res.status(200).json({
      success: true,
      message: `Telemetry simulation ${result.isActive ? 'resumed' : 'paused'}`,
      simulation: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set simulation speed (tick interval)
// @route   POST /api/system/simulation/speed
// @access  Private (Admin)
const setSimulationSpeed = async (req, res, next) => {
  try {
    const { intervalMs } = req.body;
    const result = simulatorService.setSimulationSpeed(intervalMs);
    socketService.broadcastSimulationStatus(result);

    res.status(200).json({
      success: true,
      message: `Simulation tick rate set to ${result.tickRateMs}ms`,
      simulation: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset and re-seed clean demonstration data
// @route   POST /api/system/reset-demo
// @access  Private (Admin)
const resetDemoData = async (req, res, next) => {
  try {
    await seedInitialData();
    res.status(200).json({
      success: true,
      message: 'Demo dataset reset successfully with 8 autonomous units, missions, and telemetry history.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSystemStatus,
  toggleSimulation,
  setSimulationSpeed,
  resetDemoData,
};
