import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Activity,
  AlertTriangle,
  Compass,
  Battery,
  Radio,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  Flame,
  Gauge,
  Layers,
  ArrowRight,
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import DeviceCard from '../components/devices/DeviceCard';
import FleetMap from '../components/map/FleetMap';
import AnomalyInjectorModal from '../components/alerts/AnomalyInjectorModal';
import { CardSkeleton, ChartSkeleton } from '../components/common/LoadingSkeleton';
import { analyticsService } from '../services/analyticsService';
import { deviceService } from '../services/deviceService';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { formatRelativeTime } from '../utils/formatters';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

const DashboardPage = () => {
  const { isAdmin } = useAuth();
  const { liveTelemetry, recentTelemetryFeed } = useSocket();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [devices, setDevices] = useState([]);
  const [trends, setTrends] = useState(null);
  const [injectorOpen, setInjectorOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [metricRes, deviceRes, trendRes] = await Promise.all([
        analyticsService.getDashboardMetrics(),
        deviceService.getDevices(),
        analyticsService.getTrends('24h'),
      ]);

      if (metricRes.success) setMetrics(metricRes);
      if (deviceRes.success) setDevices(deviceRes.devices || []);
      if (trendRes.success) setTrends(trendRes);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Sync live telemetry map changes to devices array
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
        lastCommunication: live.timestamp || d.lastCommunication,
        latitude: live.latitude || d.latitude,
        longitude: live.longitude || d.longitude,
      };
    }
    return d;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  const kpi = metrics?.kpis || {};
  const healthData = metrics?.healthDistribution || [];
  const missionData = metrics?.missionStats || {};

  const missionPie = [
    { name: 'Active', value: missionData.active || 0, color: '#06b6d4' },
    { name: 'Completed', value: missionData.completed || 0, color: '#10b981' },
    { name: 'Pending', value: missionData.pending || 0, color: '#f59e0b' },
    { name: 'Failed', value: missionData.failed || 0, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner: Title, Refresh Button, Anomaly Test Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Autonomous Systems Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time multi-agent telemetry orchestration, fleet tracking, and cloud analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Anomaly Injector Trigger */}
          <button
            onClick={() => setInjectorOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all shadow-sm"
          >
            <Flame className="w-4 h-4 text-amber-400" /> Viva Test Anomaly
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl glass-panel border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors"
            title="Refresh Fleet State"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Systems"
          value={kpi.totalSystems || activeDeviceList.length}
          icon={Bot}
          subtitle="Autonomous Nodes"
          colorScheme="cyan"
        />

        <StatCard
          title="Active Systems"
          value={kpi.activeSystems || 0}
          icon={Activity}
          subtitle="Online & Operating"
          colorScheme="emerald"
        />

        <StatCard
          title="Critical Alerts"
          value={kpi.criticalAlerts || 0}
          icon={AlertTriangle}
          subtitle="Requires Attention"
          colorScheme="rose"
        />

        <StatCard
          title="Active Missions"
          value={kpi.activeMissions || 0}
          icon={Compass}
          subtitle="In Transit / Patrol"
          colorScheme="indigo"
        />

        <StatCard
          title="Average Battery"
          value={kpi.averageBattery || 0}
          unit="%"
          icon={Battery}
          subtitle="Fleet Energy Level"
          colorScheme="amber"
        />

        <StatCard
          title="Total Distance"
          value={kpi.totalDistance || 0}
          unit="km"
          icon={Gauge}
          subtitle="Autonomous Mileage"
          colorScheme="cyan"
        />
      </div>

      {/* Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Battery Stream Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white">Live Fleet Telemetry Curves</h3>
              <p className="text-xs text-slate-400">Time-series battery & speed variation</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Live Ingestion
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends?.recentTelemetry || []}>
                <defs>
                  <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="deviceId" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="battery"
                  name="Battery (%)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#batteryGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="speed"
                  name="Speed (km/h)"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#speedGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health Distribution Donut */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="font-bold text-base text-white">System Health Overview</h3>
            <p className="text-xs text-slate-400">Current status breakdown across nodes</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
            {healthData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Fleet Radar Map Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" /> Live Fleet Tracking Map
            </h2>
            <p className="text-xs text-slate-400">
              High-precision geospatial positioning coordinates updated over WebSockets
            </p>
          </div>
          <Link
            to="/map"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
          >
            Fullscreen Radar <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <FleetMap devices={activeDeviceList} height="h-[380px]" />
      </div>

      {/* Live Autonomous Systems Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" /> Live Autonomous Systems ({activeDeviceList.length})
            </h2>
            <p className="text-xs text-slate-400">
              Active cloud-connected mobile robots, drones, and heavy industrial vehicles
            </p>
          </div>

          <Link
            to="/devices"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
          >
            View All Systems <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeDeviceList.slice(0, 4).map((device) => (
            <DeviceCard key={device.deviceId} device={device} />
          ))}
        </div>
      </div>

      {/* Real-time Telemetry Ingestion Marquee / Feed */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Cloud Ingestion Log Stream
          </div>
          <Link to="/telemetry" className="text-xs text-slate-400 hover:text-white">
            Open Full Log Explorer &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="pb-2 font-medium">TIMESTAMP</th>
                <th className="pb-2 font-medium">DEVICE</th>
                <th className="pb-2 font-medium">BATTERY</th>
                <th className="pb-2 font-medium">SPEED</th>
                <th className="pb-2 font-medium">TEMP</th>
                <th className="pb-2 font-medium">SIGNAL</th>
                <th className="pb-2 font-medium">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-mono text-slate-300">
              {(recentTelemetryFeed.length > 0 ? recentTelemetryFeed.slice(0, 5) : activeDeviceList.slice(0, 5)).map(
                (item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 text-slate-400">
                      {item.timestamp ? formatRelativeTime(item.timestamp) : 'Live Tick'}
                    </td>
                    <td className="py-2.5 font-bold text-cyan-300">{item.deviceId}</td>
                    <td className="py-2.5">{item.battery?.toFixed(1)}%</td>
                    <td className="py-2.5">{item.speed?.toFixed(1)} km/h</td>
                    <td className="py-2.5">{item.temperature?.toFixed(1)}&deg;C</td>
                    <td className="py-2.5">{item.signalStrength?.toFixed(0)}%</td>
                    <td className="py-2.5">
                      <StatusBadge status={item.status || 'Online'} size="sm" />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Viva Test Anomaly Injector Modal */}
      <AnomalyInjectorModal
        isOpen={injectorOpen}
        onClose={() => setInjectorOpen(false)}
        onInjected={fetchDashboardData}
      />
    </div>
  );
};

export default DashboardPage;
