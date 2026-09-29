const Device = require('../models/Device');
const Telemetry = require('../models/Telemetry');
const Mission = require('../models/Mission');
const alertEngine = require('./alertEngineService');
const socketService = require('./socketService');
const { moveCoordinate } = require('../utils/geoUtils');

let simulationInterval = null;
let isSimulationActive = true;
let tickRateMs = 3000;
let forcedAnomalies = new Map(); // deviceId -> { battery, temperature, signalStrength, offline }

// Device heading/patrol memory
const deviceHeadingMap = new Map();

const startSimulator = () => {
  if (simulationInterval) clearInterval(simulationInterval);
  isSimulationActive = true;
  console.log(`🚀 Telemetry Simulator Started [Tick Rate: ${tickRateMs}ms]`);

  simulationInterval = setInterval(async () => {
    if (!isSimulationActive) return;
    try {
      await runSimulationCycle();
    } catch (err) {
      console.error('Simulation Cycle Error:', err.message);
    }
  }, tickRateMs);
};

const stopSimulator = () => {
  isSimulationActive = false;
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  console.log('⏹️ Telemetry Simulator Stopped');
};

const getSimulationState = () => ({
  isActive: isSimulationActive,
  tickRateMs,
  forcedAnomaliesCount: forcedAnomalies.size,
});

const setSimulationSpeed = (ms) => {
  tickRateMs = Math.max(1000, Math.min(10000, Number(ms) || 3000));
  if (isSimulationActive) {
    startSimulator();
  }
  return { isActive: isSimulationActive, tickRateMs };
};

const toggleSimulation = (status) => {
  if (typeof status === 'boolean') {
    isSimulationActive = status;
  } else {
    isSimulationActive = !isSimulationActive;
  }
  if (isSimulationActive && !simulationInterval) {
    startSimulator();
  }
  return { isActive: isSimulationActive, tickRateMs };
};

const injectAnomaly = (deviceId, anomalyType) => {
  const current = forcedAnomalies.get(deviceId) || {};
  if (anomalyType === 'LOW_BATTERY') {
    forcedAnomalies.set(deviceId, { ...current, battery: 14.5 });
  } else if (anomalyType === 'OVERHEAT') {
    forcedAnomalies.set(deviceId, { ...current, temperature: 78.4 });
  } else if (anomalyType === 'WEAK_SIGNAL') {
    forcedAnomalies.set(deviceId, { ...current, signalStrength: 21.0 });
  } else if (anomalyType === 'OFFLINE') {
    forcedAnomalies.set(deviceId, { ...current, offline: true });
  } else if (anomalyType === 'RESTORE') {
    forcedAnomalies.delete(deviceId);
  }
  return { deviceId, activeOverrides: forcedAnomalies.get(deviceId) || 'Nominal' };
};

const runSimulationCycle = async () => {
  const devices = await Device.find({ isSimulated: true });
  if (!devices || devices.length === 0) return;

  for (const device of devices) {
    const override = forcedAnomalies.get(device.deviceId);

    // If unit is forced offline
    if (override && override.offline) {
      continue; // Skip transmitting telemetry
    }

    // Dynamic heading angle for circular/organic patrol path
    let heading = deviceHeadingMap.get(device.deviceId) || Math.floor(Math.random() * 360);
    heading = (heading + (Math.random() * 20 - 10) + 360) % 360;
    deviceHeadingMap.set(device.deviceId, heading);

    // Speed calculation based on device type
    let baseSpeed = 0;
    if (device.type === 'Drone') baseSpeed = 48 + Math.random() * 18;
    else if (device.type === 'Autonomous Vehicle') baseSpeed = 38 + Math.random() * 15;
    else if (device.type === 'Autonomous Robot') baseSpeed = 12 + Math.random() * 6;
    else if (device.type === 'Industrial Robot') baseSpeed = 4 + Math.random() * 3;

    // Battery variation (slow natural drain or recharge)
    let newBattery = device.battery - (0.05 + Math.random() * 0.1);
    if (newBattery <= 5) newBattery = 98; // simulated dock recharge reset

    // Temperature fluctuation based on speed & natural variance
    let newTemp = 36 + (baseSpeed / 10) + (Math.random() * 3 - 1.5);

    // Signal strength fluctuation
    let newSignal = 92 + (Math.random() * 8 - 4);

    // Distance increment
    const timeDeltaSeconds = tickRateMs / 1000;
    const distanceDeltaKm = (baseSpeed * timeDeltaSeconds) / 3600;
    const newDistance = Number((device.distanceTravelled + distanceDeltaKm).toFixed(3));

    // Coordinate movement
    const newCoords = moveCoordinate(
      device.latitude,
      device.longitude,
      baseSpeed,
      heading,
      timeDeltaSeconds
    );

    // Apply manual forced anomalies if present
    if (override) {
      if (override.battery !== undefined) newBattery = override.battery;
      if (override.temperature !== undefined) newTemp = override.temperature;
      if (override.signalStrength !== undefined) newSignal = override.signalStrength;
    }

    // Determine health status based on telemetry metrics
    let computedStatus = 'Online';
    if (newBattery < 20 || newTemp > 75) {
      computedStatus = 'Critical';
    } else if (newBattery < 35 || newTemp > 65 || newSignal < 35) {
      computedStatus = 'Warning';
    }

    // Update Device Document
    device.battery = Math.max(0, Math.min(100, Number(newBattery.toFixed(1))));
    device.speed = Number(baseSpeed.toFixed(1));
    device.temperature = Number(newTemp.toFixed(1));
    device.signalStrength = Math.max(0, Math.min(100, Number(newSignal.toFixed(0))));
    device.latitude = newCoords.latitude;
    device.longitude = newCoords.longitude;
    device.distanceTravelled = newDistance;
    device.status = computedStatus;
    device.lastCommunication = new Date();

    if (device.type === 'Drone') {
      device.altitude = Number((35 + Math.sin(Date.now() / 5000) * 15).toFixed(1));
    }

    await device.save();

    // Create Telemetry Time-Series Document
    const telemetryDoc = await Telemetry.create({
      deviceId: device.deviceId,
      battery: device.battery,
      speed: device.speed,
      temperature: device.temperature,
      latitude: device.latitude,
      longitude: device.longitude,
      altitude: device.altitude || 0,
      signalStrength: device.signalStrength,
      distanceTravelled: device.distanceTravelled,
      status: device.status,
      timestamp: new Date(),
    });

    // Advance active mission progress if assigned
    if (device.missionId) {
      const activeMission = await Mission.findById(device.missionId);
      if (activeMission && activeMission.status === 'Active') {
        const nextProgress = Math.min(100, activeMission.progress + (Math.random() * 2 + 0.5));
        activeMission.progress = Number(nextProgress.toFixed(1));
        if (activeMission.progress >= 100) {
          activeMission.status = 'Completed';
          activeMission.actualCompletion = new Date();
          device.currentMission = 'Standby / Patrol';
          await device.save();
        }
        await activeMission.save();
        socketService.broadcastMissionUpdate(activeMission);
      }
    }

    // Evaluate in Alert Engine for threshold alarms
    await alertEngine.evaluateTelemetry(device, telemetryDoc);

    // Broadcast Real-time Telemetry packet via Socket.IO
    socketService.broadcastTelemetry({
      ...telemetryDoc.toObject(),
      deviceName: device.name,
      deviceType: device.type,
      location: device.location,
    });

    socketService.broadcastDeviceUpdate(device);
  }

  // Periodic pruning of old telemetry records to maintain optimal cloud performance
  if (Math.random() < 0.05) {
    const count = await Telemetry.countDocuments();
    if (count > 2500) {
      const oldestDocs = await Telemetry.find()
        .sort({ timestamp: 1 })
        .limit(500)
        .select('_id');
      await Telemetry.deleteMany({ _id: { $in: oldestDocs.map((d) => d._id) } });
    }
  }
};

module.exports = {
  startSimulator,
  stopSimulator,
  getSimulationState,
  setSimulationSpeed,
  toggleSimulation,
  injectAnomaly,
};
