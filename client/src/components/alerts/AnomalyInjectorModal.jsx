import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { deviceService } from '../../services/deviceService';
import { alertService } from '../../services/alertService';
import { useToast } from '../../context/ToastContext';
import {
  Zap,
  BatteryCharging,
  ThermometerSnowflake,
  WifiOff,
  PowerOff,
  RotateCcw,
  Loader2,
  Sparkles,
} from 'lucide-react';

const AnomalyInjectorModal = ({ isOpen, onClose, onInjected }) => {
  const { showToast } = useToast();
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      deviceService.getDevices().then((res) => {
        if (res.success && res.devices.length > 0) {
          setDevices(res.devices);
          setSelectedDevice((prev) => prev || res.devices[0].deviceId);
        }
      });
    }
  }, [isOpen]);

  const handleInject = async (anomalyType) => {
    if (!selectedDevice) {
      showToast({ title: 'Select Device', message: 'Choose a target system first', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const res = await alertService.injectAnomaly(selectedDevice, anomalyType);
      if (res.success) {
        showToast({
          title: `Anomaly Override: ${anomalyType}`,
          message: `Injected into ${selectedDevice}. Watch Cloud Alert Engine react!`,
          type: anomalyType === 'RESTORE' ? 'success' : 'warning',
        });
        if (onInjected) onInjected();
      }
    } catch (err) {
      showToast({ title: 'Injection Failed', message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Live Anomaly Injection Console" maxWidth="max-w-xl">
      <div className="space-y-5 text-xs sm:text-sm">
        {/* Banner */}
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-white">College Viva Demonstration Tool: </span>
            Use this panel to trigger live abnormal telemetry conditions on simulated autonomous units and observe the cloud alert engine detect, categorize, and broadcast warnings via WebSockets in real time.
          </div>
        </div>

        {/* Device Selector */}
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">
            Select Target Autonomous System:
          </label>
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId} className="bg-slate-900">
                {d.name} ({d.deviceId}) &bull; {d.type} &bull; Currently {d.status} ({d.battery}%)
              </option>
            ))}
          </select>
        </div>

        {/* Anomaly Trigger Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Low Battery */}
          <button
            onClick={() => handleInject('LOW_BATTERY')}
            disabled={loading}
            className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/10 text-left transition-all group flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-amber-300">Drop Battery to 14%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Simulate critical power drain & trigger docking alarm
              </div>
            </div>
          </button>

          {/* Overheat */}
          <button
            onClick={() => handleInject('OVERHEAT')}
            disabled={loading}
            className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30 hover:border-rose-500 hover:bg-rose-500/10 text-left transition-all group flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform shrink-0">
              <ThermometerSnowflake className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-rose-300">Spike Temp to 78°C</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Simulate motor thermal overload threshold breach
              </div>
            </div>
          </button>

          {/* Weak Signal */}
          <button
            onClick={() => handleInject('WEAK_SIGNAL')}
            disabled={loading}
            className="p-3.5 rounded-xl bg-slate-900 border border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-500/10 text-left transition-all group flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 group-hover:scale-110 transition-transform shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-yellow-300">Drop Signal to 21%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Simulate antenna radio interference / mesh drop
              </div>
            </div>
          </button>

          {/* Offline Disconnect */}
          <button
            onClick={() => handleInject('OFFLINE')}
            disabled={loading}
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500 hover:bg-rose-500/10 text-left transition-all group flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:scale-110 transition-transform shrink-0">
              <PowerOff className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-200">Sever Telemetry Link</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Stop packet flow to test offline heartbeat timeout
              </div>
            </div>
          </button>
        </div>

        {/* Restore Nominal Health */}
        <div className="pt-2">
          <button
            onClick={() => handleInject('RESTORE')}
            disabled={loading}
            className="w-full p-3.5 rounded-xl bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-emerald-300">Restore Nominal Health (100% Battery & 36°C)</div>
                <div className="text-[11px] text-slate-400">Clear overrides & return unit to optimal operation</div>
              </div>
            </div>
            {loading && <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />}
          </button>
        </div>

        <div className="pt-3 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors text-xs"
          >
            Close Panel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AnomalyInjectorModal;
