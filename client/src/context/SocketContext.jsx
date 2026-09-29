import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [liveTelemetry, setLiveTelemetry] = useState({});
  const [recentTelemetryFeed, setRecentTelemetryFeed] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [simulationState, setSimulationState] = useState({ isActive: true, tickRateMs: 3000 });
  const [soundEnabled, setSoundEnabled] = useState(true);

  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket Gateway
    const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/';
    const s = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = s;
    setSocket(s);

    s.on('connect', () => {
      setIsConnected(true);
      console.log('📡 Connected to AutoCloud Telemetry WebSocket Gateway');
    });

    s.on('disconnect', () => {
      setIsConnected(false);
      console.log('⚠️ Disconnected from Telemetry Stream');
    });

    // Handle live telemetry streams
    s.on('telemetry:stream', (packet) => {
      setLiveTelemetry((prev) => ({
        ...prev,
        [packet.deviceId]: packet,
      }));

      setRecentTelemetryFeed((prev) => [packet, ...prev.slice(0, 49)]);
    });

    // Handle new incoming alerts
    s.on('alert:new', (alert) => {
      setActiveAlerts((prev) => [alert, ...prev.filter((a) => a._id !== alert._id)]);
      
      showToast({
        title: `🚨 ${alert.severity.toUpperCase()} ALERT: ${alert.deviceId}`,
        message: alert.message,
        type: alert.severity === 'Critical' ? 'error' : 'warning',
      });
    });

    // Handle alert resolution
    s.on('alert:resolved', (alert) => {
      setActiveAlerts((prev) => prev.filter((a) => a._id !== alert._id));
      showToast({
        title: `✅ Alert Resolved: ${alert.deviceId}`,
        message: `Status marked resolved`,
        type: 'success',
      });
    });

    // Handle simulation state updates
    s.on('simulation:status', (state) => {
      setSimulationState(state);
    });

    return () => {
      s.disconnect();
    };
  }, [showToast]);

  const value = {
    socket,
    isConnected,
    liveTelemetry,
    recentTelemetryFeed,
    activeAlerts,
    simulationState,
    soundEnabled,
    setSoundEnabled,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
