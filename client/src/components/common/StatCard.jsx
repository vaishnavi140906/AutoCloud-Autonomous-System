import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({
  title,
  value,
  unit = '',
  icon: Icon,
  trend,
  trendDirection = 'up',
  subtitle,
  colorScheme = 'cyan',
  onClick,
}) => {
  const colorMap = {
    cyan: {
      border: 'hover:border-cyan-500/50',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.3)]',
    },
    indigo: {
      border: 'hover:border-indigo-500/50',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.3)]',
    },
    emerald: {
      border: 'hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)]',
    },
    amber: {
      border: 'hover:border-amber-500/50',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.3)]',
    },
    rose: {
      border: 'hover:border-rose-500/50',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(244,63,94,0.3)]',
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.cyan;

  return (
    <div
      onClick={onClick}
      className={`group relative p-5 rounded-2xl glass-panel border border-slate-800/80 transition-all duration-300 ${scheme.border} ${scheme.glow} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${scheme.iconBg} transition-transform group-hover:scale-110`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
          {value !== undefined && value !== null ? value : '--'}
        </span>
        {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs">
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 font-medium ${
              trendDirection === 'up' ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trendDirection === 'up' ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {trend}
          </span>
        )}
        {subtitle && <span className="text-slate-400 truncate">{subtitle}</span>}
      </div>
    </div>
  );
};

export default StatCard;
