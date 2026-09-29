import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Battery,
  Thermometer,
  Navigation,
  Gauge,
  Calendar,
  Layers,
  RefreshCw,
  Download,
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import { ChartSkeleton } from '../components/common/LoadingSkeleton';
import { analyticsService } from '../services/analyticsService';
import { useToast } from '../context/ToastContext';

import {
  ResponsiveContainer,
  LineChart,
  Line,
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

const COLORS = ['#06b6d4', '#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#a855f7'];

const AnalyticsPage = () => {
  const { showToast } = useToast();
  const [timeRange, setTimeRange] = useState('7d');
  const [trends, setTrends] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const [trendRes, metricRes] = await Promise.all([
        analyticsService.getTrends(timeRange),
        analyticsService.getDashboardMetrics(),
      ]);
      if (trendRes.success) setTrends(trendRes);
      if (metricRes.success) setMetrics(metricRes.kpis);
    } catch (err) {
      showToast({ title: 'Analytics Error', message: err.message, type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const devices = trends?.devices || [];
  const typeDistribution = trends?.typeDistribution || [];
  const recentTelemetry = trends?.recentTelemetry || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-cyan-400" /> Cloud Fleet Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor long-term telemetry trends, thermal stress profiles, and energy consumption.
          </p>
        </div>

        {/* Time Range Filter Switcher */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {[
              { label: '24 Hours', val: '24h' },
              { label: '7 Days', val: '7d' },
              { label: '30 Days', val: '30d' },
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setTimeRange(tab.val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === tab.val
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchAnalytics();
            }}
            className="p-2 rounded-xl glass-panel border border-slate-700 text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Fleet Mileage"
          value={metrics?.totalDistance || 0}
          unit="km"
          icon={Gauge}
          subtitle="Cumulative Autonomous Range"
          colorScheme="cyan"
        />

        <StatCard
          title="Average Battery"
          value={metrics?.averageBattery || 0}
          unit="%"
          icon={Battery}
          subtitle="Energy Storage Efficiency"
          colorScheme="emerald"
        />

        <StatCard
          title="Core Thermal Mean"
          value={metrics?.averageTemperature || 0}
          unit="°C"
          icon={Thermometer}
          subtitle="Thermal Stress Index"
          colorScheme="amber"
        />

        <StatCard
          title="Telemetry Records"
          value={metrics?.totalTelemetryRecords || 0}
          icon={Activity}
          subtitle="Cloud Ingestion Points"
          colorScheme="indigo"
        />
      </div>

      {/* Charts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Mileage Comparison per Device */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-base text-white mb-1">
              Autonomous Mileage Leaderboard (km)
            </h3>
            <p className="text-xs text-slate-400 mb-4">Total distance traversed by each unit</p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={devices}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="deviceId" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="distanceTravelled" name="Distance (km)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Fleet Thermal Stress Analysis */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-base text-white mb-1">
              Thermal Stress Profile (&deg;C)
            </h3>
            <p className="text-xs text-slate-400 mb-4">Core operating temperatures across systems</p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={devices}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="deviceId" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="temperature" name="Temp (°C)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Fleet Vehicle Composition */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-white mb-1">Fleet Vehicle Composition</h3>
              <p className="text-xs text-slate-400 mb-4">Autonomous system category distribution</p>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="type"
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Signal & Mesh Uplink Quality */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-base text-white mb-1">
              Mesh Signal Quality Index (%)
            </h3>
            <p className="text-xs text-slate-400 mb-4">Cloud packet transmission reliability</p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={devices}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="deviceId" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="signalStrength" name="Signal (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
