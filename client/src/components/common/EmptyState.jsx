import React from 'react';
import { Bot } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Bot,
  title = 'No Records Found',
  description = 'No autonomous system data matches your search query or filter criteria.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-panel border border-slate-800/80 rounded-2xl">
      <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-cyan-400 mb-4 shadow-glow-cyan/20">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all shadow-lg shadow-cyan-600/30 hover:scale-105 active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
