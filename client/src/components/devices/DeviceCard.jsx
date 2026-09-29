import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Plane,
  Truck,
  Cog,
  Battery,
  Navigation,
  Thermometer,
  Radio,
  MapPin,
  ChevronRight,
  Edit2,
  Trash2,
  Activity,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatRelativeTime, getBatteryColor } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const getDeviceIcon = (type) => {
  switch (type) {
    case 'Drone':
      return Plane;
    case 'Autonomous Vehicle':
      return Truck;
    case 'Industrial Robot':
      return Cog;
    default:
      return Bot;
  }
};

const DeviceCard = ({ device, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();
  const Icon = getDeviceIcon(device.type);

  return (
    <div className="glass-panel group rounded-2xl border border-slate-800/90 p-5 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.2)] flex flex-col justify-between">
      {/* Card Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 group-hover:scale-110 group-hover:border-cyan-500/30 transition-all shadow-inner">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                {device.name}
              </h3>
              <div className="text-[11px] font-mono text-slate-400">
                {device.deviceId} &bull; {device.type}
              </div>
            </div>
          </div>
          <StatusBadge status={device.status} size="sm" />
        </div>

        {/* Operating Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{device.location}</span>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 mb-4 text-center">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <Navigation className="w-3 h-3 text-cyan-400" /> Speed
            </div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">
              {device.speed?.toFixed(1) || 0} <span className="text-[10px] text-slate-400 font-normal">km/h</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <Thermometer className="w-3 h-3 text-rose-400" /> Temp
            </div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">
              {device.temperature?.toFixed(1) || 0}&deg;C
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400" /> Signal
            </div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">
              {device.signalStrength?.toFixed(0) || 0}%
            </div>
          </div>
        </div>

        {/* Battery Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Battery className={`w-3.5 h-3.5 ${getBatteryColor(device.battery)}`} /> Battery
            </span>
            <span className="font-mono font-bold text-slate-200">
              {device.battery?.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                device.battery > 50
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                  : device.battery > 20
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-rose-600 to-rose-400 animate-pulse'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, device.battery))}%` }}
            />
          </div>
        </div>

        {/* Current Mission */}
        <div className="text-xs text-slate-300 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60 mb-4 flex items-center justify-between">
          <span className="text-slate-400">Mission:</span>
          <span className="font-semibold text-cyan-300 truncate max-w-[150px]">
            {device.currentMission || 'Standby / Patrol'}
          </span>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-mono">
          Seen: {formatRelativeTime(device.lastCommunication)}
        </span>

        <div className="flex items-center gap-1.5">
          {isAdmin && onEdit && (
            <button
              onClick={() => onEdit(device)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
              title="Edit Device"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(device)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Device"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <Link
            to={`/devices/${device._id || device.deviceId}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-cyan-600 rounded-lg transition-all"
          >
            Telemetry <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
