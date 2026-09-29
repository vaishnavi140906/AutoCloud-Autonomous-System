import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sliders,
  Database,
  Cpu,
  RefreshCw,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  RotateCcw,
  ShieldAlert,
  Server,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { systemService } from '../services/systemService';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const SettingsPage = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const { simulationState, soundEnabled, setSoundEnabled } = useSocket();

  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [simInterval, setSimInterval] = useState(simulationState.tickRateMs || 3000);

  const fetchStatus = async () => {
    try {
      const res = await systemService.getStatus();
      if (res.success) {
        setSystemStatus(res.status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleToggleSimulation = async () => {
    try {
      const res = await systemService.toggleSimulation(!simulationState.isActive);
      if (res.success) {
        showToast({
          title: 'Simulation Updated',
          message: res.message,
          type: 'info',
        });
      }
    } catch (err) {
      showToast({ title: 'Error', message: err.message, type: 'error' });
    }
  };

  const handleSetSpeed = async (intervalMs) => {
    setSimInterval(intervalMs);
    try {
      const res = await systemService.setSimulationSpeed(intervalMs);
      if (res.success) {
        showToast({
          title: 'Tick Rate Updated',
          message: `Simulation updates streaming every ${intervalMs}ms`,
          type: 'success',
        });
      }
    } catch (err) {
      showToast({ title: 'Speed Update Failed', message: err.message, type: 'error' });
    }
  };

  const handleResetDemoData = async () => {
    if (!window.confirm('Reset all autonomous systems, missions, and alerts to standard initial demo state?')) {
      return;
    }
    setResetting(true);
    try {
      const res = await systemService.resetDemoData();
      if (res.success) {
        showToast({
          title: 'Demo Dataset Reset',
          message: 'Database seeded with 8 autonomous nodes and fresh telemetry.',
          type: 'success',
        });
      }
    } catch (err) {
      showToast({ title: 'Reset Failed', message: err.message, type: 'error' });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-cyan-400" /> Platform & Simulator Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure runtime telemetry generation, cloud database parameters, and presentation modes.
        </p>
      </div>

      {/* Simulator Engine Controls Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Telemetry Simulation Engine
              </h3>
              <p className="text-xs text-slate-400">
                Continuous dynamic physics computation & WebSocket broadcasting
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleSimulation}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
              simulationState.isActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald/20'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {simulationState.isActive ? '● SIMULATION RUNNING' : '○ SIMULATION PAUSED'}
          </button>
        </div>

        {/* Speed presets */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Telemetry Ingestion Tick Interval:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Fast (1000ms)', val: 1000 },
              { label: 'Standard (3000ms)', val: 3000 },
              { label: 'Relaxed (5000ms)', val: 5000 },
            ].map((preset) => (
              <button
                key={preset.val}
                onClick={() => handleSetSpeed(preset.val)}
                className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                  simInterval === preset.val
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-glow-cyan/20'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cloud Environment & Database Health */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-white border-b border-slate-800 pb-2 flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-400" /> Cloud Database & Cluster Health
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Database Host:</span>
            <div className="font-mono font-bold text-cyan-300">
              {systemStatus?.database?.host || 'MongoDB Atlas Cluster'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Connection Status:</span>
            <div className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Connected & Active
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Server Uptime:</span>
            <div className="font-mono font-bold text-slate-200">
              {systemStatus?.uptimeSeconds || 0} seconds
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Node Environment:</span>
            <div className="font-mono font-bold text-indigo-400 uppercase">
              {systemStatus?.environment || 'Development'}
            </div>
          </div>
        </div>
      </div>

      {/* UI Customization & Audio Chimes */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-white border-b border-slate-800 pb-2 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-400" /> Interface & Audio Preferences
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div>
            <div className="font-bold text-sm text-white">Appearance Theme</div>
            <div className="text-xs text-slate-400">Toggle between Dark Cyber and Light mode</div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white flex items-center gap-2 hover:bg-slate-700 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>{isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}</span>
          </button>
        </div>
      </div>

      {/* Demonstration Data Reset (Admin only) */}
      {isAdmin && (
        <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 bg-rose-950/10 space-y-3">
          <h3 className="font-bold text-base text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" /> Viva Demonstration Reset
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Quickly re-populate the MongoDB database with the fresh initial dataset (8 autonomous units, 8 missions, alerts, and baseline telemetry) for live college viva demonstrations.
          </p>

          <button
            onClick={handleResetDemoData}
            disabled={resetting}
            className="px-5 py-2.5 font-bold text-xs text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {resetting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            Reset Demonstration Dataset
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
