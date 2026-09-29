let io = null;

const initSocket = (serverIo) => {
  io = serverIo;

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected to AutoCloud Realtime Stream: ${socket.id}`);

    // Join specific device room if requested
    socket.on('join:device', (deviceId) => {
      socket.join(`device:${deviceId}`);
      console.log(`Socket ${socket.id} joined room device:${deviceId}`);
    });

    socket.on('leave:device', (deviceId) => {
      socket.leave(`device:${deviceId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected from Stream: ${socket.id}`);
    });
  });
};

const getIO = () => {
  return io;
};

const broadcastTelemetry = (telemetryData) => {
  if (!io) return;
  io.emit('telemetry:stream', telemetryData);
  if (telemetryData.deviceId) {
    io.to(`device:${telemetryData.deviceId}`).emit('telemetry:device', telemetryData);
  }
};

const broadcastDeviceUpdate = (deviceData) => {
  if (!io) return;
  io.emit('device:update', deviceData);
};

const broadcastDeviceList = (devices) => {
  if (!io) return;
  io.emit('devices:list', devices);
};

const broadcastAlert = (alertData) => {
  if (!io) return;
  io.emit('alert:new', alertData);
};

const broadcastAlertResolved = (alertData) => {
  if (!io) return;
  io.emit('alert:resolved', alertData);
};

const broadcastMissionUpdate = (missionData) => {
  if (!io) return;
  io.emit('mission:update', missionData);
};

const broadcastNotification = (notificationData) => {
  if (!io) return;
  io.emit('notification:new', notificationData);
};

const broadcastSimulationStatus = (status) => {
  if (!io) return;
  io.emit('simulation:status', status);
};

module.exports = {
  initSocket,
  getIO,
  broadcastTelemetry,
  broadcastDeviceUpdate,
  broadcastDeviceList,
  broadcastAlert,
  broadcastAlertResolved,
  broadcastMissionUpdate,
  broadcastNotification,
  broadcastSimulationStatus,
};
