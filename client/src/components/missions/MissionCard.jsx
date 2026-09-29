import React from 'react';
import {
  Compass,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  Trash2,
  Check,
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const getPriorityBadge = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'critical':
      return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    case 'high':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    case 'medium':
      return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
  }
};

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        icon: CheckCircle,
      };
    case 'active':
      return {
        bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        icon: Compass,
      };
    case 'failed':
    case 'cancelled':
      return {
        bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        icon: XCircle,
      };
    default:
      return {
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        icon: Clock,
      };
  }
};

const MissionCard = ({ mission, onStatusChange, onDelete }) => {
  const { isAdmin } = useAuth();
  const statusInfo = getStatusBadge(mission.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="glass-panel group rounded-2xl border border-slate-800/90 p-5 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.15)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
              {mission.missionName}
            </h3>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold ${getPriorityBadge(
                mission.priority
              )}`}
            >
              {mission.priority}
            </span>
          </div>
          <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-2">
            <span>Unit: <strong className="text-cyan-300">{mission.deviceId}</strong></span>
            {mission.payloadWeight && <span>&bull; Payload: {mission.payloadWeight}kg</span>}
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-semibold ${statusInfo.bg}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {mission.status}
        </span>
      </div>

      {/* Origin -> Destination Visual Track */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 mb-4">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate max-w-[130px]">{mission.source}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 mx-2" />
          <div className="flex items-center gap-1.5 font-medium text-right">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[130px]">{mission.destination}</span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-1 mt-3">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-slate-400">Mission Progress</span>
            <span className="text-cyan-400 font-bold">{mission.progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                mission.status === 'Completed'
                  ? 'bg-emerald-500'
                  : mission.status === 'Failed' || mission.status === 'Cancelled'
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
              }`}
              style={{ width: `${mission.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800 text-xs">
        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" />
          ETA: {formatDate(mission.estimatedCompletion)}
        </div>

        <div className="flex items-center gap-2">
          {mission.status === 'Active' && onStatusChange && (
            <button
              onClick={() => onStatusChange(mission._id, 'Completed')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors"
            >
              <Check className="w-3 h-3" /> Complete
            </button>
          )}

          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(mission._id)}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Mission"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionCard;
