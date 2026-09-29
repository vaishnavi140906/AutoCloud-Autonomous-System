import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bot,
  Battery,
  Navigation,
  Thermometer,
  Radio,
  MapPin,
  Clock,
  Compass,
  AlertTriangle,
  RotateCcw,
  Octagon,
  Anchor,
  Zap,
  Activity,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import FleetMap from '../components/map/FleetMap';
import { deviceService } from '../services/deviceService';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import { formatDate, formatRelativeTime, getBatteryColor } from '../utils/formatters';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const DeviceDetailPage = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const { liveTelemetry } = useSocket();

  const [device, setDevice] = useState(null);
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commandLoading, setCommandLoading] = useState(false);

  const fetchDeviceDetails = async () => {
    try {
      const res = await deviceService.getDeviceById(id);
      if (res.success) {
        setDevice(res.device);
        setTelemetryHistory(res.telemetryHistory || []);
        setActiveAlerts(res.activeAlerts || []);
        setMissions(res.missions || []);
      }
    } catch (err) {
      showToast({ title: 'Error', message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceDetails();
  }, [id]);

  // Merge live socket packet if for this device
  const live = device ? liveTelemetry[device.deviceId] : null;
  const currentDevice = device
    ? {
        ...device,
        battery: live?.battery !== undefined ? live.battery : device.battery,
        speed: live?.speed !== undefined ? live.speed : device.speed,
        temperature: live?.temperature !== undefined ? live.temperature : device.temperature,
        signalStrength: live?.signalStrength !== undefined ? live.signalStrength : device.signalStrength,
        status: live?.status || device.status,
        lastCommunication: live?.timestamp || device.lastCommunication,
        latitude: live?.latitude || device.latitude,
        longitude: live?.longitude || device.longitude,
      }
    : null;

  // Append new live reading to telemetry history graph
  useEffect(() => {
    if (live && live.deviceId === device?.deviceId) {
      setTelemetryHistory((prev) => [...prev.slice(-19), live]);
    }
  }, [live, device?.deviceId]);

  const handleSendCommand = async (command) => {
    setCommandLoading(true);
    try {
      const res = await deviceService.sendCommand(device._id, command);
      if (res.success) {
        showToast({
          title: 'Remote Command Dispatched',
          message: res.message,
          type: 'success',
        });
        setDevice(res.device);
      }
    } catch (err) {
      showToast({ title: 'Command Failed', message: err.message, type: 'error' });
    } finally {
      setCommandLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!currentDevice) {
    return (
      <div className="text-center py-16 space-y-3">
        <h2 className="text-xl font-bold text-white">Device Not Found</h2>
        <Link to="/devices" className="text-sm text-cyan-400 hover:underline">
          &larr; Return to Systems Fleet
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <Link
            to="/devices"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors mb-2 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Systems Inventory
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentDevice.name}
            </h1>
            <StatusBadge status={currentDevice.status} />
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1 flex flex-wrap items-center gap-2">
            <span>ID: <strong className="text-cyan-300">{currentDevice.deviceId}</strong></span>
            <span>&bull;</span>
            <span>Type: {currentDevice.type}</span>
            <span>&bull;</span>
            <span>Model: {currentDevice.model}</span>
          </div>
        </div>

        {/* Remote Command Console */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSendCommand('DOCK')}
            disabled={commandLoading}
            className="px-3 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Anchor className="w-3.5 h-3.5 text-cyan-400" /> Return to Dock
          </button>

          <button
            onClick={() => handleSendCommand('EMERGENCY_STOP')}
            disabled={commandLoading}
            className="px-3 py-2 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Octagon className="w-3.5 h-3.5 text-rose-400" /> Emergency Halt
          </button>

          <button
            onClick={() => handleSendCommand('RESUME_MISSION')}
            disabled={commandLoading}
            className="px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" /> Resume Route
          </button>

          <button
            onClick={() => handleSendCommand('RECALIBRATE')}
            disabled={commandLoading}
            className="px-3 py-2 text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 rounded-xl transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" /> Recalibrate
          </button>
        </div>
      </div>

      {/* Live Telemetry Gauges Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Battery Gauge */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Battery Level
            </span>
            <div className="text-2xl font-bold font-mono text-white">
              {currentDevice.battery?.toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Autonomous Cell</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <Battery className={`w-6 h-6 ${getBatteryColor(currentDevice.battery)}`} />
          </div>
        </div>

        {/* Speed */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Velocity
            </span>
            <div className="text-2xl font-bold font-mono text-white">
              {currentDevice.speed?.toFixed(1)}{' '}
              <span className="text-xs text-slate-400 font-normal">km/h</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Current Speed</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
            <Navigation className="w-6 h-6" />
          </div>
        </div>

        {/* Temperature */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Core Temp
            </span>
            <div className="text-2xl font-bold font-mono text-white">
              {currentDevice.temperature?.toFixed(1)}&deg;C
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Motor Sensor</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-rose-400">
            <Thermometer className="w-6 h-6" />
          </div>
        </div>

        {/* Signal */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Cloud Signal
            </span>
            <div className="text-2xl font-bold font-mono text-white">
              {currentDevice.signalStrength?.toFixed(0)}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Radio Mesh Uplink</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
            <Radio className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Live Map + Telemetry Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Geo-Location Radar Map */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" /> Geographic Position Tracking
              </h3>
              <p className="text-xs text-slate-400">
                Lat: {currentDevice.latitude} &bull; Lng: {currentDevice.longitude}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              OpenStreetMap
            </span>
          </div>

          <FleetMap devices={[currentDevice]} height="h-[340px]" />
        </div>

        {/* Dynamic Telemetry Waveform Charts */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Real-Time Telemetry Trend Lines
            </h3>
            <p className="text-xs text-slate-400">
              Continuous 20-packet rolling telemetry stream
            </p>
          </div>

          <div className="h-[340px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="timestamp"
                  stroke="#64748b"
                  tickFormatter={(t) => (t ? new Date(t).toLocaleTimeString() : '')}
                  tick={{ fontSize: 9 }}
                />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="battery"
                  name="Battery (%)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="speed"
                  name="Speed (km/h)"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  name="Temp (°C)"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Details & Mission Information Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Specifications */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2">
            Hardware & Cloud Specs
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Manufacturer:</span>
              <span className="font-medium text-slate-200">{currentDevice.manufacturer}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Model Version:</span>
              <span className="font-medium text-slate-200">{currentDevice.model}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Total Distance:</span>
              <span className="font-mono text-cyan-400 font-bold">
                {currentDevice.distanceTravelled?.toFixed(2)} km
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Firmware:</span>
              <span className="font-mono text-slate-300">{currentDevice.firmwareVersion}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Last Seen:</span>
              <span className="font-mono text-slate-300">
                {formatDate(currentDevice.lastCommunication)}
              </span>
            </div>
          </div>
        </div>

        {/* Current Assigned Mission */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>Active Mission Assignment</span>
            <Link to="/missions" className="text-xs text-cyan-400 hover:underline">
              Mission Center &rarr;
            </Link>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Current Route
              </div>
              <div className="font-bold text-sm text-cyan-300 mt-0.5">
                {currentDevice.currentMission || 'Standby Patrol'}
              </div>
            </div>
            {missions.length > 0 && (
              <div className="text-xs text-slate-400">
                Latest Task: <strong className="text-slate-200">{missions[0].missionName}</strong> ({missions[0].progress}%)
              </div>
            )}
          </div>
        </div>

        {/* Active Incident Alerts */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>Incident Alerts ({activeAlerts.length})</span>
            <Link to="/alerts" className="text-xs text-cyan-400 hover:underline">
              Alerts &rarr;
            </Link>
          </h3>
          <div className="space-y-2 text-xs max-h-40 overflow-y-auto pr-1">
            {activeAlerts.length === 0 ? (
              <div className="text-slate-400 py-4 text-center">
                ✅ No active alerts for this system.
              </div>
            ) : (
              activeAlerts.map((alt) => (
                <div
                  key={alt._id}
                  className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs"
                >
                  <div className="font-bold">{alt.alertType}</div>
                  <div className="text-[11px] text-rose-200/80 mt-0.5">{alt.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailPage;
