import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Bot,
  Plane,
  Truck,
  Cog,
  RefreshCw,
  Radio,
  ExternalLink,
  Battery,
  Navigation,
} from 'lucide-react';
import FleetMap from '../components/map/FleetMap';
import StatusBadge from '../components/common/StatusBadge';
import { deviceService } from '../services/deviceService';
import { useSocket } from '../context/SocketContext';
import { Link } from 'react-router-dom';

const FleetMapPage = () => {
  const { liveTelemetry } = useSocket();
  const [devices, setDevices] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDevices = async () => {
    try {
      const res = await deviceService.getDevices();
      if (res.success) setDevices(res.devices || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Merge live telemetry data into devices
  const activeDeviceList = devices.map((d) => {
    const live = liveTelemetry[d.deviceId];
    if (live) {
      return {
        ...d,
        battery: live.battery !== undefined ? live.battery : d.battery,
        speed: live.speed !== undefined ? live.speed : d.speed,
        temperature: live.temperature !== undefined ? live.temperature : d.temperature,
        signalStrength: live.signalStrength !== undefined ? live.signalStrength : d.signalStrength,
        status: live.status || d.status,
        latitude: live.latitude || d.latitude,
        longitude: live.longitude || d.longitude,
      };
    }
    return d;
  });

  const filteredDevices =
    selectedType === 'All'
      ? activeDeviceList
      : activeDeviceList.filter((d) => d.type === selectedType);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <MapPin className="w-7 h-7 text-cyan-400" /> Fleet Geospatial Radar Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time geospatial tracking of autonomous delivery robots, sky drones, and transport vehicles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Tracking {filteredDevices.length} Active Nodes</span>
          </div>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchDevices();
            }}
            className="p-2.5 rounded-xl glass-panel border border-slate-700 text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Type Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: 'All Fleet Nodes', val: 'All' },
          { label: 'Autonomous Robots', val: 'Autonomous Robot' },
          { label: 'Sky Drones', val: 'Drone' },
          { label: 'Autonomous Vehicles', val: 'Autonomous Vehicle' },
          { label: 'Industrial AGVs', val: 'Industrial Robot' },
        ].map((item) => (
          <button
            key={item.val}
            onClick={() => setSelectedType(item.val)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedType === item.val
                ? 'bg-cyan-600 text-white shadow-glow-cyan/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <FleetMap devices={filteredDevices} height="h-[560px]" />
        </div>

        {/* Live Side Panel Roster */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 h-[560px] flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2 mb-3">
              Fleet Nodes ({filteredDevices.length})
            </h3>

            <div className="space-y-2 overflow-y-auto max-h-[460px] pr-1">
              {filteredDevices.map((d) => (
                <Link
                  key={d.deviceId}
                  to={`/devices/${d._id || d.deviceId}`}
                  className="block p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/50 transition-all text-xs group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200 group-hover:text-cyan-400">
                      {d.name}
                    </span>
                    <StatusBadge status={d.status} size="sm" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mb-2">{d.deviceId}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <Battery className="w-3 h-3 text-cyan-400" /> {d.battery?.toFixed(1)}%
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Navigation className="w-3 h-3 text-indigo-400" /> {d.speed?.toFixed(1)} km/h
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetMapPage;
