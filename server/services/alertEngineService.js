const Alert = require('../models/Alert');
const Notification = require('../models/Notification');
const socketService = require('./socketService');

// Evaluate incoming telemetry against autonomous operating rules
const evaluateTelemetry = async (device, telemetry) => {
  try {
    const alertsToGenerate = [];

    // 1. Critical Battery Condition (< 20%)
    if (telemetry.battery < 20) {
      alertsToGenerate.push({
        deviceId: device.deviceId,
        alertType: 'LOW_BATTERY',
        severity: 'Critical',
        message: `CRITICAL: ${device.name} (${device.deviceId}) battery level dropped to ${telemetry.battery.toFixed(1)}%. Immediate docking required.`,
        metadata: { battery: telemetry.battery },
      });
    }

    // 2. High Temperature Threshold (> 70°C)
    if (telemetry.temperature > 70) {
      alertsToGenerate.push({
        deviceId: device.deviceId,
        alertType: 'HIGH_TEMPERATURE',
        severity: telemetry.temperature > 85 ? 'Critical' : 'Warning',
        message: `WARNING: ${device.name} core thermal temperature exceeds nominal limits at ${telemetry.temperature.toFixed(1)}°C.`,
        metadata: { temperature: telemetry.temperature },
      });
    }

    // 3. Weak Signal Strength (< 30%)
    if (telemetry.signalStrength < 30) {
      alertsToGenerate.push({
        deviceId: device.deviceId,
        alertType: 'WEAK_SIGNAL',
        severity: 'Warning',
        message: `WARNING: Low cloud uplink signal on ${device.name} (${telemetry.signalStrength.toFixed(0)}%). Packet loss risk.`,
        metadata: { signalStrength: telemetry.signalStrength },
      });
    }

    // Process each generated alert with deduplication
    for (const alertData of alertsToGenerate) {
      // Check if an unresolved alert of this type already exists for this device within the last 5 minutes
      const existingAlert = await Alert.findOne({
        deviceId: alertData.deviceId,
        alertType: alertData.alertType,
        status: 'Active',
        createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
      });

      if (!existingAlert) {
        const newAlert = await Alert.create(alertData);

        // Also create a matching notification
        const notification = await Notification.create({
          title: `Alert: ${alertData.severity.toUpperCase()} on ${device.name}`,
          message: alertData.message,
          type: 'Alert',
          severity: alertData.severity === 'Critical' ? 'error' : 'warning',
          link: `/alerts`,
        });

        // Broadcast to clients via WebSockets
        socketService.broadcastAlert(newAlert);
        socketService.broadcastNotification(notification);
      }
    }
  } catch (error) {
    console.error('Error evaluating telemetry in Alert Engine:', error);
  }
};

// Check for lost communication on inactive devices
const checkOfflineDevices = async () => {
  try {
    const Device = require('../models/Device');
    const threshold = new Date(Date.now() - 60 * 1000); // 60 seconds without communication

    const offlineDevices = await Device.find({
      status: { $ne: 'Offline' },
      lastCommunication: { $lt: threshold },
    });

    for (const dev of offlineDevices) {
      dev.status = 'Offline';
      await dev.save();

      const existingAlert = await Alert.findOne({
        deviceId: dev.deviceId,
        alertType: 'DEVICE_OFFLINE',
        status: 'Active',
      });

      if (!existingAlert) {
        const alert = await Alert.create({
          deviceId: dev.deviceId,
          alertType: 'DEVICE_OFFLINE',
          severity: 'Critical',
          message: `CRITICAL: Cloud connection lost with autonomous unit ${dev.name} (${dev.deviceId}).`,
          metadata: { lastSeen: dev.lastCommunication },
        });

        const notif = await Notification.create({
          title: `Device Disconnected: ${dev.name}`,
          message: `Communication timed out with ${dev.deviceId}`,
          type: 'Device',
          severity: 'error',
          link: `/devices/${dev._id}`,
        });

        socketService.broadcastAlert(alert);
        socketService.broadcastNotification(notif);
        socketService.broadcastDeviceUpdate(dev);
      }
    }
  } catch (error) {
    console.error('Error checking offline devices:', error);
  }
};

module.exports = {
  evaluateTelemetry,
  checkOfflineDevices,
};
