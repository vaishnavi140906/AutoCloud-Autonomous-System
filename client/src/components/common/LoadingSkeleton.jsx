import React from 'react';

export const CardSkeleton = () => (
  <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-4 bg-slate-800 rounded w-28"></div>
      <div className="h-8 w-8 bg-slate-800 rounded-lg"></div>
    </div>
    <div className="h-8 bg-slate-800 rounded w-20 mb-3"></div>
    <div className="h-3 bg-slate-800 rounded w-36"></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="glass-panel rounded-2xl border border-slate-800/80 p-4 animate-pulse">
    <div className="h-10 bg-slate-800/70 rounded-lg mb-4"></div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 py-3 border-b border-slate-800/40">
        <div className="h-5 bg-slate-800 rounded w-24"></div>
        <div className="h-5 bg-slate-800 rounded w-32 flex-1"></div>
        <div className="h-5 bg-slate-800 rounded w-20"></div>
        <div className="h-5 bg-slate-800 rounded w-16"></div>
        <div className="h-5 bg-slate-800 rounded w-20"></div>
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 animate-pulse h-72 flex flex-col justify-between">
    <div className="flex justify-between">
      <div className="h-5 bg-slate-800 rounded w-36"></div>
      <div className="h-5 bg-slate-800 rounded w-20"></div>
    </div>
    <div className="flex items-end gap-3 h-40 pt-4">
      <div className="h-1/3 bg-slate-800 rounded w-full"></div>
      <div className="h-2/3 bg-slate-800 rounded w-full"></div>
      <div className="h-1/2 bg-slate-800 rounded w-full"></div>
      <div className="h-4/5 bg-slate-800 rounded w-full"></div>
      <div className="h-3/5 bg-slate-800 rounded w-full"></div>
      <div className="h-full bg-slate-800 rounded w-full"></div>
    </div>
  </div>
);
